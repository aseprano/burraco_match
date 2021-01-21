import { PlayerThrewCardToDiscardPile } from "../../../src/domain/events/PlayerThrewCardToDiscardPile";
import { Card, Suit } from "../../../src/domain/value_objects/Card";

describe('PlayerThrewCardToDiscardPile', () => {

    it('builds the proper payload', () => {
        expect(PlayerThrewCardToDiscardPile.EventName).toEqual('com.herrdoktor.buraco.events.PlayerThrewCardToDiscardPile');

        const event = new PlayerThrewCardToDiscardPile(
            123,
            'darkbyte',
            new Card(Suit.Clubs, 9),
        );

        expect(event.getName()).toEqual(PlayerThrewCardToDiscardPile.EventName);

        expect(event.getPayload()).toEqual({
            match_id: 123,
            player_id: 'darkbyte',
            card: { suit: Suit.Clubs, value: 9 }
        });
        
    });

});
