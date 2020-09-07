import { GameTurnToPlayer } from './GameTurnToPlayer';

describe('GameTurnToPlayer', () => {

    it('builds the proper payload', () => {
        expect(GameTurnToPlayer.EventName).toBe('com.herrdoktor.buraco.events.GameTurnToPlayer');

        const event = new GameTurnToPlayer(7, 'darkbyte');

        expect(event.getName()).toEqual(GameTurnToPlayer.EventName);

        expect(event.getPayload()).toEqual({
            match_id: 7,
            player_id: 'darkbyte',
        });
    });

});
