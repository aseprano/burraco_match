import { MatchStarted } from "./MatchStarted";

describe('MatchStarted', () => {
    it('builds the proper payload', () => {
        const event = new MatchStarted(123, 7, ['john', 'mike'], ['foo', 'bar']);

        expect(event.getName()).toEqual('com.herrdoktor.buraco.events.MatchStarted');
        expect(event.getPayload()).toEqual({
            id: 123,
            game_id: 7,
            team1: ['john', 'mike'],
            team2: ['foo', 'bar'],
        });
    })
})