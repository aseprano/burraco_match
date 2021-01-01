import { ConcreteTeamGamingArea } from "../../../src/domain/entities/impl/ConcreteTeamGamingArea";
import { ConcreteRunFactory } from "../../../src/domain/factories/impl/ConcreteRunFactory";
import { Card, Suit } from "../../../src/domain/value_objects/Card";
import { RunID } from "../../../src/domain/value_objects/RunID";
import { SequenceRun } from "../../../src/domain/entities/impl/SequenceRun";
import { GroupRun } from "../../../src/domain/entities/impl/GroupRun";
import { StdCardSerializer } from "../../../src/domain/domain-services/impl/StdCardSerializer";
import { RunCreated } from "../../../src/domain/events/RunCreated";
import { RunNotFoundException } from "../../../src/domain/exceptions/RunNotFoundException";
import { CardsMeldedToRun } from "../../../src/domain/events/CardsMeldedToRun";
import { CardList } from "../../../src/domain/value_objects/CardList";

describe('ConcreteTeamGamingArea', () => {
    const runFactory = new ConcreteRunFactory();
    const serializer = new StdCardSerializer();

    it('can be constructed with an id', () => {
        const gamingArea = new ConcreteTeamGamingArea(314, runFactory, serializer);
        expect(gamingArea.getId()).toEqual(314);
    });

    it('is empty after construction', () => {
        const gamingArea = new ConcreteTeamGamingArea(161, runFactory, serializer);
        expect(gamingArea.getRuns()).toEqual([]);
    });

    it('can build sequence runs', () => {
        const gamingArea = new ConcreteTeamGamingArea(1, runFactory, serializer);

        const newRun = gamingArea.createRun(new CardList([
            new Card(Suit.Diamonds, 3),
            new Card(Suit.Diamonds, 2),
            new Card(Suit.Diamonds, 4),
            new Card(Suit.Diamonds, 5),
        ]));

        expect(newRun).toBeInstanceOf(SequenceRun);
        expect(newRun.getId()).toEqual(new RunID(0));

        expect(newRun.asArray()).toEqual([
            new Card(Suit.Diamonds, 2),
            new Card(Suit.Diamonds, 3),
            new Card(Suit.Diamonds, 4),
            new Card(Suit.Diamonds, 5),
        ]);

        expect(newRun.getWildcardPosition()).toEqual(-1);
    });

    it('can build group runs', () => {
        const gamingArea = new ConcreteTeamGamingArea(1, runFactory, serializer);

        const newRun = gamingArea.createRun(new CardList([
            new Card(Suit.Diamonds, 3),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Hearts, 3),
            new Card(Suit.Hearts, 3),
        ]));

        expect(newRun).toBeInstanceOf(GroupRun);
        expect(newRun.getId()).toEqual(new RunID(0));

        expect(newRun.asArray()).toEqual([
            new Card(Suit.Diamonds, 3),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Hearts, 3),
            new Card(Suit.Hearts, 3),
        ]);

        expect(newRun.getWildcardPosition()).toEqual(-1);
    });
    
    it('skips events that does not match the gaming area id', () => {
        const gamingArea = new ConcreteTeamGamingArea(2, runFactory, serializer);

        const run = runFactory.build([
            new Card(Suit.Clubs, 8),
            new Card(Suit.Clubs, 9),
            new Card(Suit.Clubs, 10),
        ], new RunID(0));

        gamingArea.applyEvent(new RunCreated(123, 'darkbyte', 7, run));

        expect(gamingArea.getRuns()).toEqual([]);
    });

    it('can restore runs from event', () => {
        const gamingArea = new ConcreteTeamGamingArea(2, runFactory, serializer);

        const run1 = runFactory.build([
            new Card(Suit.Clubs, 8),
            new Card(Suit.Clubs, 9),
            new Card(Suit.Clubs, 10),
        ], new RunID(0));

        const run2 = runFactory.build([
            new Card(Suit.Clubs, 8),
            new Card(Suit.Diamonds, 8),
            new Card(Suit.Hearts, 8),
        ], new RunID(1));

        gamingArea.applyEvent(new RunCreated(123, 'darkbyte', 2, run1));
        gamingArea.applyEvent(new RunCreated(123, 'darkbyte', 2, run2));

        expect(gamingArea.getRuns()).toEqual([
            run1,
            run2,
        ]);
    });

    it('uses the highest run id to create the next run id', () => {
        const gamingArea = new ConcreteTeamGamingArea(0, runFactory, serializer);
        
        // create a mock run with id #100
        const fakeRun = GroupRun.restore(new CardList([new Card(Suit.Clubs, 7)]), -1);
        fakeRun.setId(new RunID(100));
        gamingArea.applyEvent(new RunCreated(123, 'darkbyte', 0, fakeRun));

        // next run id should be 101
        const newRun = gamingArea.createRun(new CardList([
            new Card(Suit.Diamonds, 2),
            new Card(Suit.Diamonds, 3),
            new Card(Suit.Diamonds, 4),
            new Card(Suit.Diamonds, 5),
        ]));

        expect(newRun.getId().asNumber()).toBe(101);
    });

    it('throws an error when adding cards to a non-existing run', () => {
        const gamingArea = new ConcreteTeamGamingArea(0, runFactory, serializer);

        expect(() => gamingArea.addCardsToRun(new CardList(), new RunID(123))).toThrow(new RunNotFoundException());
    });

    it('replaces an existing run when applying the CardsMeldedToRun event', () => {
        const gamingArea = new ConcreteTeamGamingArea(0, runFactory, serializer);

        const existingRun = GroupRun.restore(new CardList([new Card(Suit.Clubs, 7)]), -1);
        existingRun.setId(new RunID(18));

        gamingArea.applyEvent(new RunCreated(123, 'darkbyte', 0, existingRun));

        const newRun = GroupRun.restore(new CardList([new Card(Suit.Clubs, 7), new Card(Suit.Diamonds, 7)]), -1)
        newRun.setId(new RunID(18));

        gamingArea.applyEvent(
            new CardsMeldedToRun(
                123,
                'john',
                0,
                CardList.empty(),
                newRun
            )
        );

        expect(gamingArea.getRuns()).toEqual([newRun]);
    });
    
});
