import { PlayerPickedUpDiscardPile } from '../../../src/domain/events/PlayerPickedUpDiscardPile';
import { Card, Suit } from "../../../src/domain/value_objects/Card";
import { CardList } from "../../../src/domain/value_objects/CardList";

describe('PlayerPickedUpDiscardPile', () => {

    it('builds the proper payload', () => {
        expect(PlayerPickedUpDiscardPile.EventName).toBe('com.herrdoktor.buraco.events.PlayerPickedUpDiscardPile');

        const event = new PlayerPickedUpDiscardPile(
            123,
            'ariastark',
            new CardList([
                new Card(Suit.Clubs, 8),
                Card.Joker()
            ])
        );


        expect(event.getName()).toEqual(PlayerPickedUpDiscardPile.EventName);

        expect(event.getPayload()).toEqual({
            match_id: 123,
            player_id: 'ariastark',
            cards: [{suit: Suit.Clubs, value: 8}, {suit: Suit.Joker, value: 0}],
        });
    });

});
