import { PlayerPickedUpDiscardPile } from './PlayerPickedUpDiscardPile';
import { Card, Suit } from "../value_objects/Card";

describe('PlayerPickedUpDiscardPile', () => {

    it('builds the proper payload', () => {
        expect(PlayerPickedUpDiscardPile.EventName).toBe('com.herrdoktor.buraco.events.PlayerPickedUpDiscardPile');

        const event = new PlayerPickedUpDiscardPile(
            123,
            'ariastark',
            [
                new Card(Suit.Clubs, 8),
                Card.Joker()
            ]
        );


        expect(event.getName()).toEqual(PlayerPickedUpDiscardPile.EventName);

        expect(event.getPayload()).toEqual({
            match_id: 123,
            player_id: 'ariastark',
            cards: [{suit: Suit.Clubs, value: 8}, {suit: Suit.Joker, value: 0}],
        })
    });

});
