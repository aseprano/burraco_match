import { MatchInitialized } from "./MatchInitialized";
import { Card, Suit } from "../value_objects/Card";

describe('MatchInitialized', () => {

    it('builds the proper payload', () => {
        const event = new MatchInitialized(10, [Card.Joker(), new Card(Suit.Clubs, 2)]);
        
        expect(event.getName()).toEqual('com.herrdoktor.buraco.events.MatchInitialized');

        expect(event.getPayload()).toEqual({
            id: 10,
            cards: [{suit: Suit.Joker, value: 0}, {suit: Suit.Clubs, value: 2}]
        });
    });
    
})