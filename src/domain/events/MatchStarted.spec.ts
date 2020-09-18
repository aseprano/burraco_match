import { MatchStarted } from "./MatchStarted";
import { Card, Suit } from "../value_objects/Card";
import { CardList } from "../value_objects/CardList";

describe('MatchStarted', () => {

    it('builds the proper payload', () => {
        expect(MatchStarted.EventName).toBe('com.herrdoktor.buraco.events.MatchStarted');

        const event = new MatchStarted(
            123,
            7,
            new CardList([Card.Joker(), new Card(Suit.Clubs, 2)]),
            ['john', 'mike'],
            ['foo', 'bar']
        );

        expect(event.getName()).toEqual(MatchStarted.EventName);
        
        expect(event.getPayload()).toEqual({
            id: 123,
            game_id: 7,
            stock: [{suit: Suit.Joker, value: 0}, {suit: Suit.Clubs, value: 2}],
            team1: ['john', 'mike'],
            team2: ['foo', 'bar'],
        });
    });

});
