import { GroupRun } from './GroupRun';
import { Suit, Card } from "../../value_objects/Card";

describe('GroupRun', () => {
    const joker = Card.Joker();
    const deuceOfClubs = new Card(Suit.Clubs, 2);
    const deuceOfDiamonds = new Card(Suit.Diamonds, 2);
    const sevenOfClubs = new Card(Suit.Clubs, 7);

    it('cannot start with a joker', () => {
        expect(() => GroupRun.withCard(joker)).toThrow();
    });

    it('cannot start with a deuce', () => {
        expect(() => GroupRun.withCard(deuceOfClubs)).toThrow();
    });

    it('accepts cards of same value', () => {
        const sevenOfDiamonds = new Card(Suit.Diamonds, 7);

        const game = GroupRun.withCard(sevenOfClubs);
        game.add(sevenOfDiamonds);

        expect(game.getCards()).toEqual([
            sevenOfClubs,
            sevenOfDiamonds,
        ]);

        expect(game.getWildcardPosition()).toEqual(-1);
    });

    it('does not accept cards of different values', () => {
        const eightOfClubs = new Card(Suit.Diamonds, 8);

        const game = GroupRun.withCard(sevenOfClubs);
        expect(() => game.add(eightOfClubs)).toThrow();
    });

    it('can be made of up to 13 cards', () => {
        const game = GroupRun.withCard(sevenOfClubs);

        game.add(
            Array(12).fill(new Card(Suit.Diamonds, 7))
        );

        expect(game.getCards()).toEqual([
            new Card(Suit.Clubs, 7),
            new Card(Suit.Diamonds, 7),
            new Card(Suit.Diamonds, 7),
            new Card(Suit.Diamonds, 7),
            new Card(Suit.Diamonds, 7),
            new Card(Suit.Diamonds, 7),
            new Card(Suit.Diamonds, 7),
            new Card(Suit.Diamonds, 7),
            new Card(Suit.Diamonds, 7),
            new Card(Suit.Diamonds, 7),
            new Card(Suit.Diamonds, 7),
            new Card(Suit.Diamonds, 7),
            new Card(Suit.Diamonds, 7),
        ]);
    });

    it('cannot be made of more than 13 cards', () => {
        const listOfSevens = Array(13).fill(new Card(Suit.Diamonds, 7));

        const game = GroupRun.withCard(sevenOfClubs);
        expect(() => game.add(listOfSevens)).toThrow();
    });

    it('accepts one joker', () => {
        const game = GroupRun.withCard(sevenOfClubs)
            .add(joker);

        expect(game.getCards()).toEqual([
            joker,
            sevenOfClubs
        ]);

        expect(game.getWildcardPosition()).toEqual(0);
    });

    it('accepts one deuce as wildcard', () => {
        const game = GroupRun.withCard(sevenOfClubs)
            .add(deuceOfClubs);

        expect(game.getCards()).toEqual([
            deuceOfClubs,
            sevenOfClubs,
        ]);

        expect(game.getWildcardPosition()).toEqual(0);
    });

    it('does not accept a joker nor a deuce if a joker already exists', () => {
        const game = GroupRun.withCard(sevenOfClubs)
            .add(joker);

        expect(() => game.add(joker)).toThrow();
        expect(() => game.add(deuceOfClubs)).toThrow();
    });

    it('does not accept a joker nor a deuce if a deuce already exists', () => {
        const game = GroupRun.withCard(sevenOfClubs)
            .add(deuceOfClubs);

        expect(() => game.add(joker)).toThrow();
        expect(() => game.add(deuceOfDiamonds)).toThrow();
    });

    it('builds a GroupRun by cards and wildcard position', () => {
        const run = GroupRun.withCardsAndWildcardPosition(
            [sevenOfClubs, sevenOfClubs, sevenOfClubs, deuceOfClubs],
            3
        );

        expect(run.getCards()).toEqual([
            sevenOfClubs, sevenOfClubs, sevenOfClubs, deuceOfClubs
        ]);

        expect(run.getWildcardPosition()).toEqual(3);
    });

    it('sets the value depending on the wildcard position', () => {
        const run1 = GroupRun.withCardsAndWildcardPosition([sevenOfClubs, deuceOfClubs], 1);
        expect(run1.getValue()).toEqual(7);

        const run2 = GroupRun.withCardsAndWildcardPosition([deuceOfClubs, sevenOfClubs], 0);
        expect(run2.getValue()).toEqual(7);
    })

})