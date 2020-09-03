import { RunCreated } from "./RunCreated";
import { GroupRun } from "../entities/impl/GroupRun";
import { Card, Suit } from "../value_objects/Card";
import { RunID } from "../value_objects/RunID";
import { mock, when, instance } from "ts-mockito";

describe('RunCreated', () => {

    it('returns the proper payload', () => {
        const runCards = [
            new Card(Suit.Clubs, 8),
            new Card(Suit.Diamonds, 9),
            new Card(Suit.Hearts, 9),
        ];

        const fakeRun = mock(GroupRun);
        when(fakeRun.getId()).thenReturn(new RunID(18));
        when(fakeRun.getCards()).thenReturn(runCards);
        when(fakeRun.isSequence()).thenReturn(true);
        when(fakeRun.getWildcardPosition()).thenReturn(8);

        const event = new RunCreated(
            123,
            'darkbyte',
            instance(fakeRun)
        );

        expect(RunCreated.EventName).toBe('com.herrdoktor.buraco.events.RunCreated');
        expect(event.getName()).toEqual(RunCreated.EventName);

        expect(event.getPayload()).toEqual({
            match_id: 123,
            player_id: 'darkbyte',
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