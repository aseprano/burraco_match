import { CardsDealtToPlayer } from "./CardsDealtToPlayer";
import { Card, Suit } from "../value_objects/Card";

describe('CardsDealtToPlayer', () => {

    it('builds the proper payload', () => {
        const event = new CardsDealtToPlayer(
            10,
            [Card.Joker(), new Card(Suit.Clubs, 8)],
            'darkbyte'
        );

        expect(event.getName()).toEqual('com.herrdoktor.buraco.events.cardsDealtToPlayer');
        
        expect(event.getPayload()).toEqual({
            match_id: 10,
            cards: [{suit: Suit.Joker, value: 0}, {suit: Suit.Clubs, value: 8}],
            player_id: 'darkbyte',
        });
    });

});
