import { PlayerPickedUpDiscardPile } from './PlayerPickedUpDiscardPile';
import { PlayerID } from "../value_objects/PlayerID";
import { Card, Suit } from "../value_objects/Card";
import e from "express";

describe('PlayerPickedUpDiscardPile', () => {

    it('builds the proper payload', () => {
        const event = new PlayerPickedUpDiscardPile(
            123,
            new PlayerID('ariastark'),
            [
                new Card(Suit.Clubs, 8),
                Card.Joker()
            ]
        );

        expect(PlayerPickedUpDiscardPile.EventName).toBe('com.herrdoktor.buraco.events.PlayerPickedUpDiscardPile');

        expect(event.getName()).toEqual(PlayerPickedUpDiscardPile.EventName);

        expect(event.getPayload()).toEqual({
            match_id: 123,
            player_id: 'ariastark',
            cards: [{suit: Suit.Clubs, value: 8}, {suit: Suit.Joker, value: 0}],
        })
    });

});
