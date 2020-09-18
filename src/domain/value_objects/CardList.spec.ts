import { CardList } from "./CardList";
import { Card, Suit } from "./Card";

describe('CardList', () => {

    it('returns the list of cards it is made of', () => {
        const list = new CardList([
            new Card(Suit.Clubs, 9),
            new Card(Suit.Diamonds, 2),
            Card.Joker(),
        ]);

        expect(list.length).toBe(3);

        expect(list.cards).toEqual([
            new Card(Suit.Clubs, 9),
            new Card(Suit.Diamonds, 2),
            Card.Joker(),
        ]);
    });

    it('contains an empty list of cards', () => {
        const list = new CardList([
            new Card(Suit.Clubs, 9),
            new Card(Suit.Diamonds, 2),
            Card.Joker(),
        ]);

        expect(list.contains([])).toBeTrue();
    });

    it('can check if contains a single existing card', () => {
        const list = new CardList([
            new Card(Suit.Clubs, 9),
            new Card(Suit.Diamonds, 2),
            Card.Joker(),
        ]);

        expect(list.contains(Card.Joker())).toBeTrue();
    });

    it('can check if contains a single non-existing card', () => {
        const list = new CardList([
            new Card(Suit.Clubs, 9),
            new Card(Suit.Diamonds, 2),
            Card.Joker(),
        ]);

        expect(list.contains(new Card(Suit.Hearts, 3))).toBeFalse();
    });

    it('can check if contains a subset of cards', () => {
        const list = new CardList([
            new Card(Suit.Clubs, 9),
            new Card(Suit.Diamonds, 2),
            Card.Joker(),
        ]);

        expect(list.contains([
            Card.Joker(),
            new Card(Suit.Diamonds, 2),
        ])).toBeTrue();
    });

    it('cannot be tricked to check for the same card multiple times', () => {
        const list = new CardList([
            new Card(Suit.Clubs, 9),
            new Card(Suit.Diamonds, 2),
            Card.Joker(),
        ]);

        expect(list.contains([
            Card.Joker(),
            Card.Joker(),
        ])).toBeFalse();
    });

    it('can tell if contains all of the specified cards', () => {
        const list = new CardList([
            new Card(Suit.Clubs, 9),
            new Card(Suit.Diamonds, 2),
            Card.Joker(),
        ]);

        expect(list.contains([
            new Card(Suit.Clubs, 9),
            Card.Joker(),
            new Card(Suit.Diamonds, 2),
        ])).toBeTrue();
    });

    it('contains returns false with a mixed found/not-found cards', () => {
        const list = new CardList([
            new Card(Suit.Clubs, 9),
            new Card(Suit.Diamonds, 2),
            Card.Joker(),
        ]);

        expect(list.contains([
            new Card(Suit.Diamonds, 2),
            new Card(Suit.Diamonds, 3),
        ])).toBeFalse();
    });

    it('can remove cards while staying immutable', () => {
        const list = new CardList([
            new Card(Suit.Diamonds, 9),
            new Card(Suit.Spades, 2),
            new Card(Suit.Clubs, 3),
            Card.Joker()
        ]);

        expect(list.remove([Card.Joker()]).cards)
            .toEqual([
                new Card(Suit.Diamonds, 9),
                new Card(Suit.Spades, 2),
                new Card(Suit.Clubs, 3),
            ]);

        expect(list.cards).toEqual([
            new Card(Suit.Diamonds, 9),
            new Card(Suit.Spades, 2),
            new Card(Suit.Clubs, 3),
            Card.Joker()
        ]);
    });

    it('can be compared to another CardList for equality', () => {
        const nonEmptyList1 = new CardList([
            new Card(Suit.Clubs, 9),
            new Card(Suit.Diamonds, 2),
            Card.Joker(),
        ]);

        const nonEmptyList2 = new CardList([
            new Card(Suit.Clubs, 9),
            Card.Joker(),
            new Card(Suit.Diamonds, 2),
        ]);

        const nonEmptyList3 = new CardList([
            new Card(Suit.Clubs, 9),
            Card.Joker(),
        ]);

        const emptyList1 = new CardList([]);

        const emptyList2 = new CardList([]);

        expect(nonEmptyList1.isEqual(nonEmptyList1)).toBeTrue();
        expect(nonEmptyList1.isEqual(nonEmptyList2)).toBeTrue();
        expect(nonEmptyList1.isEqual(nonEmptyList3)).toBeFalse();
        expect(nonEmptyList1.isEqual(emptyList1)).toBeFalse();
        expect(emptyList1.isEqual(emptyList2)).toBeTrue();
    });

    it('can remove a subset of the list', () => {
        const list = new CardList([
            new Card(Suit.Clubs, 2),
            new Card(Suit.Diamonds, 7),
            new Card(Suit.Hearts, 1),
            new Card(Suit.Spades, 2)
        ]);

        const sublist = list.removeRange(1, 1);

        expect(sublist.cards).toEqual([
            new Card(Suit.Clubs, 2),
            new Card(Suit.Hearts, 1),
            new Card(Suit.Spades, 2)
        ]);
    });

});
