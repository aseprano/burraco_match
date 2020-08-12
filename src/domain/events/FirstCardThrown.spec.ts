import { FirstCardThrown } from './FirstCardThrown';
import { Card, Suit } from "../value_objects/Card";

describe('FirstCardThrown', () => {

    it('builds the proper payload', () => {
        const event = new FirstCardThrown(333, new Card(Suit.Diamonds, 9));

        expect(event.getName()).toEqual('com.herrdoktor.buraco.events.FirstCardThrown');
        expect(FirstCardThrown.EventName).toEqual(event.getName());
        expect(event.getPayload()).toEqual({
            match_id: 333,
            card: { suit: Suit.Diamonds, value: 9 }
        });
    });

})