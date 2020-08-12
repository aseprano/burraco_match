import { PotCreated } from './PotCreated';
import { CardList, Card, Suit } from "../value_objects/Card";

describe('PotCreated', () => {

    it('builds the proper payload', () => {
        const potCards: CardList = [
            new Card(Suit.Clubs, 2),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Spades, 4),
        ];

        const event = new PotCreated(123, potCards);
        
        expect(event.getName()).toEqual('com.herrdoktor.buraco.events.PotCreated');

        expect(event.getPayload()).toEqual({
            match_id: 123,
            cards: [
                { suit: Suit.Clubs, value: 2 },
                { suit: Suit.Clubs, value: 3 },
                { suit: Suit.Spades, value: 4 },
            ],
        });
    });

});