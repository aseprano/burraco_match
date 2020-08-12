import { GameTurnToPlayer } from './GameTurnToPlayer';

describe('GameTurnToPlayer', () => {

    it('builds the proper payload', () => {
        const event = new GameTurnToPlayer(7, 'darkbyte');

        expect(event.getName()).toEqual('com.herrdoktor.buraco.events.GameTurnToPlayer');

        expect(event.getPayload()).toEqual({
            match_id: 7,
            player_id: 'darkbyte',
        });
    });

});
