import { CardsDealtToPlayer } from "../../../src/domain/events/CardsDealtToPlayer";
import { Card, Suit } from "../../../src/domain/value_objects/Card";
import { CardList } from "../../../src/domain/value_objects/CardList";

describe('CardsDealtToPlayer', () => {

    it('builds the proper payload', () => {
        expect(CardsDealtToPlayer.EventName).toEqual('com.herrdoktor.buraco.events.CardsDealtToPlayer');

        const event = new CardsDealtToPlayer(
            10,
            new CardList([Card.Joker(), new Card(Suit.Clubs, 8)]),
            'darkbyte'
        );

        expect(event.getName()).toEqual(CardsDealtToPlayer.EventName);
        
        expect(event.getPayload()).toEqual({
            match_id: 10,
            cards: [{suit: Suit.Joker, value: 0}, {suit: Suit.Clubs, value: 8}],
            player_id: 'darkbyte',
        });
    });

});
