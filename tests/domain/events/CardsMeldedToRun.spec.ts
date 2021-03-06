import { CardsMeldedToRun } from "../../../src/domain/events/CardsMeldedToRun";
import { Card, Suit } from "../../../src/domain/value_objects/Card";
import { SequenceRun } from "../../../src/domain/entities/impl/SequenceRun";
import { RunID } from "../../../src/domain/value_objects/RunID";
import { CardList } from "../../../src/domain/value_objects/CardList";

describe('CardsMeldedToRun', () => {

    it('builds the proper payload', () => {
        expect(CardsMeldedToRun.EventName).toEqual('com.herrdoktor.buraco.events.CardsMeldedToRun');

        const theRun = SequenceRun.restore(
            new CardList([
                new Card(Suit.Clubs, 5),
                new Card(Suit.Clubs, 6),
                new Card(Suit.Clubs, 7),
                new Card(Suit.Clubs, 8),
                new Card(Suit.Clubs, 9),
            ]),
            -1
        );

        theRun.setId(new RunID(1984));

        const event = new CardsMeldedToRun(
            123,
            'darkbyte',
            1,
            new CardList([
                new Card(Suit.Clubs, 8),
                new Card(Suit.Clubs, 9),
            ]),
            theRun
        );

        expect(event.getName()).toEqual(CardsMeldedToRun.EventName);

        expect(event.getPayload()).toEqual({
            match_id: 123,
            player_id: 'darkbyte',
            gaming_area_id: 1,
            cards: [
                { suit: Suit.Clubs, value: 8 },
                { suit: Suit.Clubs, value: 9 },
            ],
            run: {
                id: 1984,
                type: 'sequence',
                cards: [
                    { suit: Suit.Clubs, value: 5 },
                    { suit: Suit.Clubs, value: 6 },
                    { suit: Suit.Clubs, value: 7 },
                    { suit: Suit.Clubs, value: 8 },
                    { suit: Suit.Clubs, value: 9 },
                ],
                wildcard_position: -1,
            },
        });
        
    });

});
