import { PotCreated } from './PotCreated';
import { Card, Suit } from "../value_objects/Card";
import { CardList } from "../value_objects/CardList";

describe('PotCreated', () => {

    it('builds the proper payload', () => {
        expect(PotCreated.EventName).toBe('com.herrdoktor.buraco.events.PotCreated');

        const potCards: CardList = new CardList([
            new Card(Suit.Clubs, 2),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Spades, 4),
        ]);

        const event = new PotCreated(123, potCards);
        
        expect(event.getName()).toEqual(PotCreated.EventName);

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
