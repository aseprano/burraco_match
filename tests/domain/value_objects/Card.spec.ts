import { Card, Suit } from "../../../src/domain/value_objects/Card";

describe('Card', () => {

    it('cannot have a value lower than 1 or greater than 13', () => {
        expect(() => new Card(Suit.Clubs, 0)).toThrow();
        expect(() => new Card(Suit.Clubs, 14)).toThrow();
    });

    it('cannot have a fractional value', () => {
        expect(() => new Card(Suit.Clubs, 1.1)).toThrow();
    });

    it('has value and seed properly set', () => {
        const card1 = new Card(Suit.Clubs, 1);
        expect(card1.getSuit()).toEqual(Suit.Clubs);
        expect(card1.getValue()).toEqual(1);

        const card2 = new Card(Suit.Diamonds, 13);
        expect(card2.getSuit()).toEqual(Suit.Diamonds);
        expect(card2.getValue()).toEqual(13);

        const card3 = new Card(Suit.Hearts, 2);
        expect(card3.getSuit()).toEqual(Suit.Hearts);
        expect(card3.getValue()).toEqual(2);

        const card4 = new Card(Suit.Spades, 12);
        expect(card4.getSuit()).toEqual(Suit.Spades);
        expect(card4.getValue()).toEqual(12);
    });

    it('can be a joker', () => {
        const joker = new Card(Suit.Joker, 0);
        expect(joker.getSuit()).toEqual(Suit.Joker);
        expect(joker.getValue()).toEqual(0);
    });
    
    it('can be compared to another card', () => {
        const sevenOfClubs = new Card(Suit.Clubs, 7);
        const anotherSevenOfClubs = new Card(Suit.Clubs, 7);
        const sixOfClubs = new Card(Suit.Clubs, 6);
        const sevenOfDiamonds = new Card(Suit.Diamonds, 7);

        expect(sevenOfClubs.isEqual(sevenOfClubs)).toBeTruthy();
        expect(sevenOfClubs.isEqual(anotherSevenOfClubs)).toBeTruthy();
        expect(sevenOfClubs.isEqual(sevenOfDiamonds)).toBeFalse();
        expect(sevenOfClubs.isEqual(sixOfClubs)).toBeFalse();
    });

    it('is deuce only if value is 2', () => {
        const nonDeuce = new Card(Suit.Clubs, 3);
        expect(nonDeuce.isDeuce()).toBeFalse();

        const deuce = new Card(Suit.Clubs, 2);
        expect(deuce.isDeuce()).toBeTrue();
    });
    
})