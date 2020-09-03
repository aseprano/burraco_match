import { ConcreteTeamGamingArea } from "./ConcreteTeamGamingArea";
import { ConcreteRunFactory } from "../../factories/impl/ConcreteRunFactory";
import { Card, Suit } from "../../value_objects/Card";
import { RunID } from "../../value_objects/RunID";
import { SequenceRun } from "./SequenceRun";
import { GroupRun } from "./GroupRun";
import { StdCardSerializer } from "../../domain-services/impl/StdCardSerializer";
import { RunCreated } from "../../events/RunCreated";

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

        const newRun = gamingArea.createRun([
            new Card(Suit.Diamonds, 3),
            new Card(Suit.Diamonds, 2),
            new Card(Suit.Diamonds, 4),
            new Card(Suit.Diamonds, 5),
        ]);

        expect(newRun).toBeInstanceOf(SequenceRun);
        expect(newRun.getId()).toEqual(new RunID(0));

        expect(newRun.getCards()).toEqual([
            new Card(Suit.Diamonds, 2),
            new Card(Suit.Diamonds, 3),
            new Card(Suit.Diamonds, 4),
            new Card(Suit.Diamonds, 5),
        ]);

        expect(newRun.getWildcardPosition()).toEqual(-1);
    });

    it('can build group runs', () => {
        const gamingArea = new ConcreteTeamGamingArea(1, runFactory, serializer);

        const newRun = gamingArea.createRun([
            new Card(Suit.Diamonds, 3),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Hearts, 3),
            new Card(Suit.Hearts, 3),
        ]);

        expect(newRun).toBeInstanceOf(GroupRun);
        expect(newRun.getId()).toEqual(new RunID(0));

        expect(newRun.getCards()).toEqual([
            new Card(Suit.Diamonds, 3),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Hearts, 3),
            new Card(Suit.Hearts, 3),
        ]);

        expect(newRun.getWildcardPosition()).toEqual(-1);
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

        gamingArea.applyEvent(new RunCreated(123, 'darkbyte', run1));
        gamingArea.applyEvent(new RunCreated(123, 'darkbyte', run2));

        expect(gamingArea.getRuns()).toEqual([
            run1,
            run2,
        ]);
    });
    
});
