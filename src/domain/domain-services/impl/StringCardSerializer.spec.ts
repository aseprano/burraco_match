import { BadCardFormatException } from "../../exceptions/BadCardFormatException";
import { Card, Suit } from "../../value_objects/Card";
import { CardList } from "../../value_objects/CardList";
import { StringCardSerializer } from "./StringCardSerializer";

describe('StringCardSerializer', () => {
    const serializer = new StringCardSerializer();

    it('serializes one card', () => {
        expect(serializer.serializeCard(Card.Joker()))
            .toEqual('*');

        expect(serializer.serializeCard(new Card(Suit.Clubs, 1)))
            .toEqual('1C');

        expect(serializer.serializeCard(new Card(Suit.Clubs, 13)))
            .toEqual('13C');

        expect(serializer.serializeCard(new Card(Suit.Diamonds, 1)))
            .toEqual('1D');

        expect(serializer.serializeCard(new Card(Suit.Diamonds, 13)))
            .toEqual('13D');

        expect(serializer.serializeCard(new Card(Suit.Hearts, 1)))
            .toEqual('1H');

        expect(serializer.serializeCard(new Card(Suit.Hearts, 13)))
            .toEqual('13H');

        expect(serializer.serializeCard(new Card(Suit.Spades, 1)))
            .toEqual('1S');

        expect(serializer.serializeCard(new Card(Suit.Spades, 13)))
            .toEqual('13S');
    });

    it('serializes more cards', () => {
        expect(serializer.serializeCards(new CardList([Card.Joker(), new Card(Suit.Clubs, 2)])))
            .toEqual([
                '*',
                '2C',
            ]);
    });

    it('unserializes one card', () => {
        expect(serializer.unserializeCard('1D'))
            .toEqual(new Card(Suit.Diamonds, 1));

        expect(serializer.unserializeCard('13S'))
            .toEqual(new Card(Suit.Spades, 13));

        expect(serializer.unserializeCard('9H'))
            .toEqual(new Card(Suit.Hearts, 9));
            
        expect(serializer.unserializeCard('10C'))
            .toEqual(new Card(Suit.Clubs, 10));

        expect(serializer.unserializeCard('*'))
            .toEqual(Card.Joker());
    });

    it('unserializes a list of cards', () => {
        expect(serializer.unserializeCards([
            '13S',
            '1D',
            '9C',
            '10H',
            '*'
        ]).asArray()).toEqual([
            new Card(Suit.Spades, 13),
            new Card(Suit.Diamonds, 1),
            new Card(Suit.Clubs, 9),
            new Card(Suit.Hearts, 10),
            Card.Joker(),
        ]);
    });

    it('throws when trying to unserialize a non string', () => {
        const expectedException = new BadCardFormatException();

        expect(() => serializer.unserializeCard(1)).toThrow(expectedException);
        expect(() => serializer.unserializeCard({})).toThrow(expectedException);
        expect(() => serializer.unserializeCard(null)).toThrow(expectedException);
        expect(() => serializer.unserializeCard(undefined)).toThrow(expectedException);
    });

    it('throws when trying to unserialize a string in a wrong format', () => {
        const expectedException = new BadCardFormatException();

        expect(() => serializer.unserializeCard('0S')).toThrow(expectedException);
        expect(() => serializer.unserializeCard('1N')).toThrow(expectedException);
        expect(() => serializer.unserializeCard('14S')).toThrow(expectedException);
        expect(() => serializer.unserializeCard('13P')).toThrow(expectedException);
        expect(() => serializer.unserializeCard('13')).toThrow(expectedException);
        expect(() => serializer.unserializeCard('*D')).toThrow(expectedException);
        expect(() => serializer.unserializeCard('')).toThrow(expectedException);
    });

});