import { SequenceRun } from "../src/domain/entities/impl/SequenceRun";
import { Card, Suit } from "../src/domain/value_objects/Card";

describe('SequenceRun', () => {

    function getCard(value: number): Card {
        return new Card(Suit.Clubs, value);
    }

    const joker = Card.Joker();
    const deuceOfClubs = getCard(2);
    
    it('is fine', () => {
        const run = SequenceRun.restore([
            Card.Joker(),
            new Card(Suit.Clubs, 6),
            new Card(Suit.Clubs, 7)
        ], 0);

        expect(run.getCards().asArray()).toEqual([
            Card.Joker(),
            new Card(Suit.Clubs, 6),
            new Card(Suit.Clubs, 7)
        ]);

        expect(run.getWildcardPosition()).toEqual(0);
    });

    it('bla', () => {
        const queenOfClubs = getCard(12);
        const aceOfClubs = getCard(1);
        const deuceOfClubs = getCard(2);

        const game = SequenceRun.restore([deuceOfClubs, queenOfClubs], 0)
            .add(aceOfClubs);            //   QC,*,1C

        expect(game.getCards().asArray()).toEqual([
            queenOfClubs,
            deuceOfClubs,
            aceOfClubs,
        ]);

        expect(game.getWildcardPosition()).toBe(1);
    });

});
