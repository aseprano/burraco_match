import { MatchStarted } from "./MatchStarted";

describe('MatchStarted', () => {
    it('builds the proper payload', () => {
        const event = new MatchStarted(123, 9, ['john', 'mike'], ['abe', 'kim']);

        expect(event.getName()).toEqual('com.herrdoktor.buraco.events.MatchStarted');
        expect(event.getPayload()).toEqual({
            id: 123,
            gameId: 9,
            team1: ['john', 'mike'],
            team2: ['abe', 'kim'],
        });
    })
})