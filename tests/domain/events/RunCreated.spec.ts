import { RunCreated } from "../../../src/domain/events/RunCreated";
import { GroupRun } from "../../../src/domain/entities/impl/GroupRun";
import { Card, Suit } from "../../../src/domain/value_objects/Card";
import { RunID } from "../../../src/domain/value_objects/RunID";
import { mock, when, instance } from "ts-mockito";
import { CardList } from "../../../src/domain/value_objects/CardList";

describe('RunCreated', () => {

    it('returns the proper payload', () => {
        expect(RunCreated.EventName).toBe('com.herrdoktor.buraco.events.RunCreated');
        
        const runCards = [
            new Card(Suit.Clubs, 8),
            new Card(Suit.Diamonds, 9),
            new Card(Suit.Hearts, 9),
        ];

        const fakeRun = mock(GroupRun);
        when(fakeRun.getId()).thenReturn(new RunID(18));
        when(fakeRun.getCards()).thenReturn(new CardList(runCards));
        when(fakeRun.isSequence()).thenReturn(true);
        when(fakeRun.getWildcardPosition()).thenReturn(8);

        const event = new RunCreated(
            123,
            'darkbyte',
            1,
            instance(fakeRun)
        );

        expect(event.getName()).toEqual(RunCreated.EventName);

        expect(event.getPayload()).toEqual({
            match_id: 123,
            player_id: 'darkbyte',
            gaming_area_id: 1,
            run: {
                id: 18,
                cards: [
                    {suit: Suit.Clubs,    value: 8},
                    {suit: Suit.Diamonds, value: 9},
                    {suit: Suit.Hearts,   value: 9},
                ],
                type: 'sequence',
                wildcard_position: 8
            },
        });
    });

});
