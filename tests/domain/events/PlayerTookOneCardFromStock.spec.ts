import { PlayerTookOneCardFromStock } from "../../../src/domain/events/PlayerTookOneCardFromStock";
import { Card, Suit } from "../../../src/domain/value_objects/Card";

describe('PlayerTookOneCardFromStock', () => {

    it('builds the proper payload', () => {
        expect(PlayerTookOneCardFromStock.EventName).toEqual('com.herrdoktor.buraco.events.PlayerTookOneCardFromStock');

        const event = new PlayerTookOneCardFromStock(123, 'jonsnow', Card.Joker());

        expect(event.getName()).toEqual(PlayerTookOneCardFromStock.EventName);

        expect(event.getPayload()).toEqual({
            match_id: 123,
            player_id: 'jonsnow',
            card: { value: 0, suit: Suit.Joker }
        });
    });

});