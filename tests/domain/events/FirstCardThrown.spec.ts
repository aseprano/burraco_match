import { FirstCardThrown } from '../../../src/domain/events/FirstCardThrown';
import { Card, Suit } from "../../../src/domain/value_objects/Card";

describe('FirstCardThrown', () => {

    it('builds the proper payload', () => {
        expect(FirstCardThrown.EventName).toBe('com.herrdoktor.buraco.events.FirstCardThrown');

        const event = new FirstCardThrown(333, new Card(Suit.Diamonds, 9));

        expect(event.getName()).toBe(FirstCardThrown.EventName);

        expect(event.getPayload()).toEqual({
            match_id: 333,
            card: { suit: Suit.Diamonds, value: 9 }
        });
    });

})