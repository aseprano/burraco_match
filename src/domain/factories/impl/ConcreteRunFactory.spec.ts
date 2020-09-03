import { ConcreteRunFactory } from "./ConcreteRunFactory";
import { Card, Suit } from "../../value_objects/Card";
import { RunID } from "../../value_objects/RunID";
import { SequenceRun } from "../../entities/impl/SequenceRun";
import { GroupRun } from "../../entities/impl/GroupRun";
import { CannotBuildRunException } from "../../exceptions/CannotBuildRunException";

describe('ConcreteRunFactory', () => {
    const factory = new ConcreteRunFactory();

    it('can build a SequenceRun', () => {
        const run = factory.build(
            [
                Card.Joker(),
                new Card(Suit.Clubs, 7),
                new Card(Suit.Clubs, 9),
                new Card(Suit.Clubs, 8),
            ],
            new RunID(123)
        );

        expect(run).toBeInstanceOf(SequenceRun);
        expect(run.getId()).toEqual(new RunID(123));

        expect(run.getCards()).toEqual([
            Card.Joker(),
            new Card(Suit.Clubs, 7),
            new Card(Suit.Clubs, 8),
            new Card(Suit.Clubs, 9),
        ]);

        expect(run.getWildcardPosition()).toEqual(0);
    });

    it('can build a GroupRun', () => {
        const run = factory.build(
            [
                Card.Joker(),
                new Card(Suit.Clubs, 7),
                new Card(Suit.Diamonds, 7),
                new Card(Suit.Hearts, 7),
            ],
            new RunID(123)
        );

        expect(run).toBeInstanceOf(GroupRun);
        expect(run.getId()).toEqual(new RunID(123));

        expect(run.getCards()).toEqual([
            Card.Joker(),
            new Card(Suit.Clubs, 7),
            new Card(Suit.Diamonds, 7),
            new Card(Suit.Hearts, 7),
        ]);

        expect(run.getWildcardPosition()).toEqual(0);
    });

    it('throws an exception if no run can be built', () => {
        expect(() => factory.build([
            new Card(Suit.Clubs, 8),
            new Card(Suit.Clubs, 9),
            new Card(Suit.Clubs, 3),
        ], new RunID(123))).toThrow(new CannotBuildRunException());
    });

});
