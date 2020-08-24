import { PlayerTookOneCardFromStock } from "./PlayerTookOneCardFromStock";
import { PlayerID } from "../value_objects/PlayerID";
import { Card, Suit } from "../value_objects/Card";

describe('PlayerTookOneCardFromStock', () => {

    it('builds the proper payload', () => {
        expect(PlayerTookOneCardFromStock.EventName).toEqual('com.herrdoktor.buraco.events.PlayerTookOneCardFromStock');

        const event = new PlayerTookOneCardFromStock(123, new PlayerID('jonsnow'), Card.Joker());

        expect(event.getName()).toEqual(PlayerTookOneCardFromStock.EventName);

        expect(event.getPayload()).toEqual({
            match_id: 123,
            player_id: 'jonsnow',
            card: { value: 0, suit: Suit.Joker }
        });
    });

});