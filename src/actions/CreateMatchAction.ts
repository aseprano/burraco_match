import { MicroserviceAction } from "./MicroserviceAction";
import { Request } from 'express';

import { BadPlayerIDException } from "../domain/exceptions/BadPlayerIDException";
import { MatchPlayersException } from "../domain/exceptions/MatchPlayersException";
import { PlayerID } from "../domain/value_objects/PlayerID";
import { Team } from "../domain/value_objects/Team";
import { ApiResponse, MicroserviceApiError, MicroserviceApiResponse } from '@darkbyte/herr';

/**
 * @summary Creates a new match
 * @method POST
 * @url /matches
 * 
 * @parameter players [array[PlayerID], required] The list of player, starting from NORTH, clockwise
 * @parameter game_id [number, required] The id of the game that the match belongs to
 * 
 * @status 2001 Invalid game id
 * @status 2002 Bad players format
 * @status 2003 Invalid number of players
 * @status 2004 Duplicated players
 */
export class CreateMatchAction extends MicroserviceAction {

    private parseGameId(request: Request): number {
        const gameId = request.body.game_id;

        if (typeof gameId !== 'number') {
            throw new MicroserviceApiError(400, 2001, 'Invalid game id');
        }

        return gameId;
    }

    private parsePlayers(request: Request): Array<PlayerID> {
        const players = request.body.players;

        if (!Array.isArray(players)) {
            throw new MicroserviceApiError(400, 2002, 'Bad players format');
        }

        return players.map((playerId) => new PlayerID(playerId));
    }
    
    public requiredParameters(): string[] {
        return [
            'game_id',
            'players',
        ];
    }

    public async serveRequest(request: Request): Promise<ApiResponse> {
        const gameId = this.parseGameId(request);
        const players = this.parsePlayers(request);

        if (players.length !== 2 && players.length !== 4) {
            return new MicroserviceApiError(400, 2003, 'Invalid number of players');
        }

        try {
            let matchId;

            if (players.length === 2) {
                matchId = await this.matchService
                    .start1v1(
                        gameId,
                        players[0],
                        players[1]
                    );
            } else {
                matchId = await this.matchService
                    .start2v2(
                        gameId,
                        new Team(
                            players[0],
                            players[2],
                        ),
                        new Team(
                            players[1],
                            players[3],
                        ),
                    );
            }

            return new MicroserviceApiResponse({
                match_id: matchId
            });
        } catch (e) {
            if (e instanceof MatchPlayersException) {
                return new MicroserviceApiError(400, 2002, 'Bad players format');
            } else if (e instanceof BadPlayerIDException) {
                return new MicroserviceApiError(400, 2004, 'Duplicated players')
            } else {
                throw e;
            }
        }
    }
}
