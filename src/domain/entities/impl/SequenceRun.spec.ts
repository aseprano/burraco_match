import { SequenceRun } from "./SequenceRun";
import { Suit, Card } from "../../value_objects/Card";
import { RunID } from "../../value_objects/RunID";

describe('SequenceRun', () => {
    const joker = Card.Joker();
    const deuceOfClubs = new Card(Suit.Clubs, 2);

    function getCard(value: number): Card {
        return new Card(Suit.Clubs, value);
    }

    it('cannot start with a deuce or joker', () => {
        expect(() => SequenceRun.withCard(deuceOfClubs)).toThrow();
        expect(() => SequenceRun.withCard(joker)).toThrow();
    });

    it('can start with a non-deuce and non-joker card', () => {
        const three = getCard(3);
        const game = SequenceRun.withCard(three);

        expect(game.getSuit()).toEqual(Suit.Clubs);
        expect(game.getCards()).toEqual([ three ]);
        expect(game.getWildcardPosition()).toEqual(-1);
    });

    it('cannot add a card of a different suit', () => {
        const fourOfClubs = getCard(4);
        const game = SequenceRun.withCard(fourOfClubs); // a run of clubs

        const fiveOfDiamonds = new Card(Suit.Diamonds, 5);
        expect(() => game.add(fiveOfDiamonds)).toThrow();
    });

    it('can be added a sequencial card', () => {
        const threeOfClubs = getCard(3);
        const fourOfClubs = getCard(4);

        const game = SequenceRun.withCard(threeOfClubs)
            .add(fourOfClubs);

        expect(game.getCards()).toEqual([
            threeOfClubs,
            fourOfClubs,
        ]);

        expect(game.getWildcardPosition()).toEqual(-1);
    });

    it('is mutable', () => {
        const threeOfClubs = getCard(3);
        const fourOfClubs = getCard(4);

        const game = SequenceRun.withCard(threeOfClubs)
            .add(fourOfClubs);

        expect(game.getCards()).toEqual([
            threeOfClubs,
            fourOfClubs
        ]);
    });

    it('can be set an id', () => {
        const run = SequenceRun.withCard(getCard(6));
        run.setId(new RunID(10));
        expect(run.getId()).toEqual(new RunID(10));
    });

    it('cannot add a card that cannot be linked at bottom nor at top', () => {
        const fiveOfClubs = getCard(5);
        const aceOfClubs = getCard(1);
        const run = SequenceRun.withCard(fiveOfClubs);
        expect(() => run.add(aceOfClubs)).toThrow();
    });

    it('restores the old status if cannot be modified', () => {
        const run = SequenceRun.withCard(getCard(5))
            .add([
                getCard(6),
                getCard(7)
            ]);

        expect(() => run.add([
            getCard(8),
            getCard(9),
            getCard(13)
        ])).toThrow();

        expect(run.getCards()).toEqual([
            getCard(5),
            getCard(6),
            getCard(7)
        ]);
    });

    it('adds the ace after the king', () => {
        const kingOfSpades = getCard(13);
        const aceOfSpades = getCard(1);

        const game = SequenceRun.withCard(kingOfSpades)
            .add(aceOfSpades);

        expect(game.getCards()).toEqual([
            kingOfSpades,
            aceOfSpades
        ]);
    });

    it('adds the king below thea ace if the ace is the only card of the run', () => {
        const kingOfSpades = getCard(13);
        const aceOfSpades = getCard(1);

        const game = SequenceRun.withCard(aceOfSpades)
            .add(kingOfSpades);

        expect(game.getCards()).toEqual([
            kingOfSpades,
            aceOfSpades
        ]);
    });

    it('adds a natural deuce after the ace', () => {
        const aceOfClubs = getCard(1);
        const deuceOfClubs = getCard(2);

        const game = SequenceRun.withCard(aceOfClubs)
            .add(deuceOfClubs);

        expect(game.getCards()).toEqual([
            aceOfClubs,
            deuceOfClubs
        ]);

        expect(game.getWildcardPosition()).toBe(-1);
    });

    it('adds a natural deuce below the three', () => {
        const threeOfClubs = getCard(3);

        const game = SequenceRun.withCard(threeOfClubs)
            .add(deuceOfClubs);

        expect(game.getCards()).toEqual([
            deuceOfClubs,
            threeOfClubs
        ]);

        expect(game.getWildcardPosition()).toBe(-1);
    });

    it('adds a deuce as wildcard', () => {
        const aceOfClubs = getCard(1);
        const threeOfClubs = getCard(3);
        const fiveOfClubs = getCard(5);

        const game1 = SequenceRun.withCard(fiveOfClubs)
            .add(deuceOfClubs);

        expect(game1.getCards()).toEqual([
            deuceOfClubs,
            fiveOfClubs
        ]);

        expect(game1.getWildcardPosition()).toBe(0);

        const game2 = SequenceRun.withCard(aceOfClubs)
            .add(deuceOfClubs)
            .add(deuceOfClubs);

        expect(game2.getCards()).toEqual([
            aceOfClubs,
            deuceOfClubs,
            deuceOfClubs
        ]);

        expect(game2.getWildcardPosition()).toBe(2);

        const game3 = SequenceRun.withCard(aceOfClubs)
            .add([deuceOfClubs, threeOfClubs])
            .add(deuceOfClubs);

        expect(game3.getCards())
            .toEqual([
                aceOfClubs,
                deuceOfClubs,
                threeOfClubs,
                deuceOfClubs,
            ]);

        expect(game3.getWildcardPosition()).toBe(3);
    });

    it('promotes the bottom wildcard to the top', () => {
        const threeOfClubs = getCard(3);
        const fiveOfClubs = getCard(5);

        const game = SequenceRun.withCard(threeOfClubs)
            .add([deuceOfClubs, deuceOfClubs])
            .add(fiveOfClubs);

        expect(game.getCards()).toEqual([
            deuceOfClubs,
            threeOfClubs,
            deuceOfClubs,
            fiveOfClubs
        ]);

        expect(game.getWildcardPosition()).toBe(2);
    });

    it('promotes the bottom duce as top-wildcard', () => {
        const threeOfClubs = getCard(3);
        const fourOfClubs = getCard(4);
        const sixOfClubs = getCard(6);

        const game = SequenceRun.withCardsAndWildcardPosition([deuceOfClubs, threeOfClubs, fourOfClubs], -1)
            .add(sixOfClubs);

        expect(game.getCards()).toEqual([
            threeOfClubs,
            fourOfClubs,
            deuceOfClubs,
            sixOfClubs
        ]);

        expect(game.getWildcardPosition()).toBe(2);
    });

    it('replaces the wildcard', () => {
        const aceOfClubs = getCard(1);
        const threeOfClubs = getCard(3);
        
        const game1 = SequenceRun.withCard(aceOfClubs)
            .add([deuceOfClubs, deuceOfClubs])
            .add(threeOfClubs);

        expect(game1.getCards())
            .toEqual([
                aceOfClubs,
                deuceOfClubs,
                threeOfClubs,
                deuceOfClubs
            ]);

        expect(game1.getWildcardPosition())
            .toBe(3);

        const fourOfClubs = getCard(4);
        const fiveOfClubs = getCard(5);
        const sixOfClubs = getCard(6);

        const game2 = SequenceRun.withCard(fourOfClubs)
            .add([deuceOfClubs, sixOfClubs])
            .add(fiveOfClubs);

        expect(game2.getCards())
            .toEqual([
                deuceOfClubs,
                fourOfClubs,
                fiveOfClubs,
                sixOfClubs
            ]);

        expect(game2.getWildcardPosition())
            .toBe(0);
    });

    it('replaces the wildcard representing the king', () => {
        const queenOfClubs = getCard(12);
        const kingOfClubs = getCard(13);
        const aceOfClubs = getCard(1);
        const deuceOfClubs = getCard(2);

        const game = SequenceRun.withCard(queenOfClubs)
            .add([deuceOfClubs, aceOfClubs])
            .add(kingOfClubs);

        expect(game.getCards()).toEqual([
            deuceOfClubs,
            queenOfClubs,
            kingOfClubs,
            aceOfClubs
        ]);

        expect(game.getWildcardPosition()).toBe(0);
    });

    it('inserts a card below the bottom wildcard', () => {
        const fiveOfClubs = getCard(5);
        const threeOfClubs = getCard(3);

        const game = SequenceRun
            .withCard(fiveOfClubs) //      5C
            .add(deuceOfClubs)     //    *,5C
            .add(threeOfClubs);    // 3C,*,5C

        expect(game.getCards()).toEqual([
            threeOfClubs,
            deuceOfClubs,
            fiveOfClubs
        ]);

        expect(game.getWildcardPosition()).toBe(1);
    });

    it('inserts a card above the top wildcard', () => {
        const aceOfClubs = getCard(1);
        const threeOfClubs = getCard(3);
        const fiveOfClubs = getCard(5);

        const game = SequenceRun
            .withCard(aceOfClubs) // 1C
            .add([
                deuceOfClubs,     // 1C,2C,3C,*
                deuceOfClubs,
                threeOfClubs
            ])
            .add(fiveOfClubs);    // 1C,2C,3C,*,5C

        expect(game.getCards()).toEqual([
            aceOfClubs,
            deuceOfClubs,
            threeOfClubs,
            deuceOfClubs,
            fiveOfClubs
        ]);

        expect(game.getWildcardPosition()).toBe(3);
    });

    it('cannot add a king below an ace if the ace is the bottommost card of a sequence', () => {
        const aceOfClubs = getCard(1);
        const kingOfClubs = getCard(13);

        const game = SequenceRun
            .withCard(aceOfClubs)
            .add(deuceOfClubs);

        expect(() => game.add(kingOfClubs)).toThrow();
    });

    it('inserts a deuce as wildcard at the top if the bottommost cars is an ace', () => {
        const game = SequenceRun.withCardsAndWildcardPosition([
            getCard(1),
            getCard(2),
            getCard(3)
        ], -1).add(deuceOfClubs);

        expect(game.getCards()).toEqual([
            getCard(1),
            getCard(2),
            getCard(3),
            getCard(2)
        ]);

        expect(game.getWildcardPosition()).toBe(3);
    });

    it('inserts the deuce as wildcard as bottommost card if the sequence does not start with an ace', () => {
        const threeOfClubs = getCard(3);

        const game = SequenceRun.withCardsAndWildcardPosition(
            [
                deuceOfClubs, // natural deuce
                threeOfClubs,
            ],
            -1
        ).add(deuceOfClubs);

        expect(game.getCards()).toEqual([
            deuceOfClubs,
            deuceOfClubs,
            threeOfClubs,
        ]);

        expect(game.getWildcardPosition()).toBe(0);
    });

    it('promotes the bottom wildcard to king to link an ace', () => {
        const queenOfClubs = getCard(12);
        const aceOfClubs = getCard(1);

        const game = SequenceRun
            .withCard(queenOfClubs) //   QC
            .add(deuceOfClubs)      // *,QC
            .add(aceOfClubs);       //   QC,*,1C

        expect(game.getCards()).toEqual([
            queenOfClubs,
            deuceOfClubs,
            aceOfClubs
        ]);

        expect(game.getWildcardPosition()).toBe(1);
    });

    it('adds a joker at bottom if bottommost card is not an ace', () => {
        const sixOfClubs = getCard(6);

        const run = SequenceRun.withCard(sixOfClubs);
        run.add(joker);

        expect(run.getCards()).toEqual([joker, sixOfClubs]);
        expect(run.getWildcardPosition()).toEqual(0);
    });

    it('adds a joker at top if the bottommost card is an ace', () => {
        const aceOfClubs = getCard(1);
        
        const run = SequenceRun.withCard(aceOfClubs);
        run.add(joker);

        expect(run.getCards()).toEqual([aceOfClubs, joker]);
        expect(run.getWildcardPosition()).toEqual(1);
    });

    it('cannot add a duce as wildcard if a wildcard already has been used', () => {
        const aceOfClubs = getCard(1);

        const run = SequenceRun.withCard(aceOfClubs)
            .add(deuceOfClubs)
            .add(deuceOfClubs);
        
        expect(() => run.add(deuceOfClubs)).toThrow();
    });

    it('wildcard is not replaced when trying to add new card that cannot take place of wildcard', () => {
        const aceOfClubs = getCard(1);
        const fiveOfClubs = getCard(5);

        const run = SequenceRun.withCard(aceOfClubs)
            .add(deuceOfClubs)
            .add(deuceOfClubs);

        expect(() => run.add(fiveOfClubs)).toThrow();
    });

    it('moves the joker to a new position if it gets replaced', () => {
        const fiveOfClubs = getCard(5);
        const sixOfClubs = getCard(6);
        const sevenOfClubs = getCard(7);

        const run = SequenceRun.withCardsAndWildcardPosition([fiveOfClubs, joker, sevenOfClubs], 1)
            .add(sixOfClubs);

        expect(run.getCards()).toEqual([joker, fiveOfClubs, sixOfClubs, sevenOfClubs]);
        expect(run.getWildcardPosition()).toEqual(0);
    });

    it('moves the joker from bottom to a new position if it gets replaced', () => {
        const fiveOfClubs = getCard(5);
        const sixOfClubs = getCard(6);
        const sevenOfClubs = getCard(7);

        const run = SequenceRun.withCardsAndWildcardPosition([joker, sixOfClubs, sevenOfClubs], 0)
            .add(fiveOfClubs);

        expect(run.getCards()).toEqual([joker, fiveOfClubs, sixOfClubs, sevenOfClubs]);
        expect(run.getWildcardPosition()).toEqual(0);
    });

    it('moves the joker up if it is replaced', () => {
        const aceOfClubs = getCard(1);
        const threeOfClubs = getCard(3);
        
        const run = SequenceRun.withCardsAndWildcardPosition([aceOfClubs, deuceOfClubs, joker], 2);
        run.add(threeOfClubs);

        expect(run.getCards()).toEqual([aceOfClubs, deuceOfClubs, threeOfClubs, joker]);
        expect(run.getWildcardPosition()).toEqual(3);
    });

    it('can be set cards and wildcard position', () => {
        const threeOfClubs = getCard(3);
        const fourOfClubs = getCard(4);

        const run = SequenceRun.withCard(threeOfClubs);
        run.set([threeOfClubs, fourOfClubs, deuceOfClubs], 2);
        expect(run.getCards()).toEqual([threeOfClubs, fourOfClubs, deuceOfClubs]);
        expect(run.getWildcardPosition()).toEqual(2);
    });

});
