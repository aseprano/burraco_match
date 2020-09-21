import { Card, Suit } from "../../value_objects/Card";
import { CardList } from "../../value_objects/CardList";
import { CardsValueCalculator } from "./CardsValueCalculator";

describe('CardsValueCalculator', () => {
    const calculator = new CardsValueCalculator();

    it('can calculate the value of the single cards', () => {
        expect(calculator.getValueOfCard(Card.Joker())).toEqual(30);
        expect(calculator.getValueOfCard(new Card(Suit.Clubs, 2))).toEqual(20);
        expect(calculator.getValueOfCard(new Card(Suit.Clubs, 1))).toEqual(15);
        expect(calculator.getValueOfCard(new Card(Suit.Clubs, 3))).toEqual(5);
        expect(calculator.getValueOfCard(new Card(Suit.Clubs, 7))).toEqual(5);
        expect(calculator.getValueOfCard(new Card(Suit.Clubs, 8))).toEqual(10);
        expect(calculator.getValueOfCard(new Card(Suit.Clubs, 13))).toEqual(10);
    });

    it('can calculate the sum of the values', () => {
        const cards = new CardList([
            Card.Joker(),
            new Card(Suit.Clubs, 2),
            new Card(Suit.Diamonds, 3),
            new Card(Suit.Hearts, 1),
            new Card(Suit.Spades, 4),
            new Card(Suit.Clubs, 7),
            new Card(Suit.Hearts, 8),
        ]);

        expect(calculator.getValueOfCards(cards)).toEqual(90);
    });

});
