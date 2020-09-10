import { PlayerTookPot } from './PlayerTookPot';
import { Card, Suit } from "../value_objects/Card";
import { CardList } from "../value_objects/CardList";

describe('PlayerTookPot', () => {

    it('builds the proper payload', () => {
        expect(PlayerTookPot.EventName).toBe('com.herrdoktor.buraco.events.PlayerTookPot');

        const event = new PlayerTookPot(
            123,
            'darkbyte',
            new CardList([
                new Card(Suit.Clubs, 9),
                new Card(Suit.Diamonds, 2),
            ])
        );

        expect(event.getName()).toEqual(PlayerTookPot.EventName);

        expect(event.getPayload()).toEqual({
            match_id: 123,
            player_id: 'darkbyte',
            cards: [
                { suit: Suit.Clubs, value: 9 },
                { suit: Suit.Diamonds, value: 2 },
            ],
        });

    });

});
