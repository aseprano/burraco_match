import { DiscardPileInitialized } from "./DiscardPileInitialized";
import { Card, Suit } from "../value_objects/Card";

describe('DiscardPileInitialized', () => {

    it('builds the proper payload', () => {
        const event = new DiscardPileInitialized(7, Card.Joker());

        expect(event.getName()).toEqual('com.herrdoktor.buraco.events.DiscardPileInitialized');

        expect(event.getPayload()).toEqual({
            match_id: 7,
            card: {suit: Suit.Joker, value: 0}
        });
        
    });

});
