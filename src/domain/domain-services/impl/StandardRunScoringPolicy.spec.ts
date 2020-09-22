import { Card, Suit } from "../../value_objects/Card";
import { CardList } from "../../value_objects/CardList";
import { StandardRunScoringPolicy } from './StandardRunScoringPolicy';

describe('StandardRunScoringPolicy', () => {
    const policy = new StandardRunScoringPolicy();

    it('returns 0 for runs with less than 7 cards', () => {
        const score = policy.getScore(new CardList(), -1);

        expect(score).toBe(0);
    });

    it('returns 200 points for clean runs', () => {
        const score = policy.getScore(new CardList([
            new Card(Suit.Clubs, 3),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Clubs, 3),
        ]), -1);

        expect(score).toBe(200);
    });

    it('returns 100 points for dirty runs', () => {
        const score = policy.getScore(new CardList([
            new Card(Suit.Clubs, 3),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Clubs, 2),
        ]), 6);

        expect(score).toBe(100);
    });

    it('does not allow half-dirty runs', () => {
        const score = policy.getScore(new CardList([
            new Card(Suit.Clubs, 3),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Clubs, 2),
        ]), 7);

        expect(score).toBe(100);
    });

});
