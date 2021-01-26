import { MicroserviceAction } from './MicroserviceAction';
import { Request } from 'express';
import { ApiResponse, Context, Injectable, MicroserviceApiError, MicroserviceApiResponse } from '@darkbyte/herr';

import { Team } from '../domain/value_objects/Team';
import { MatchPlayersException } from '../domain/exceptions/MatchPlayersException';
import { BadTeamException } from '../domain/exceptions/BadTeamException';

/**
 * @summary Creates a new match
 * @method POST
 * @url /matches
 * 
 * @parameter players [array[PlayerID], required] The list of player, starting from NORTH, clockwise
 * @parameter game_id [number, required] The id of the game that the match belongs to
 * 
 * @status 2001 Invalid number of players
 * @status 2002 Bad players list
 */
@Injectable()
export class CreateMatchAction extends MicroserviceAction {
    
    public requiredParameters(): string[] {
        return [
            'game_id',
            'players',
        ];
    }

    public async serveRequest(request: Request, context: Context): Promise<ApiResponse> {
        const gameId = this.parseGameId(request);
        const players = this.parsePlayers(request);

        if (players.length !== 2 && players.length !== 4) {
            return new MicroserviceApiError(400, 2001, 'Invalid number of players');
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
            if (e instanceof MatchPlayersException || e instanceof BadTeamException) {
                return new MicroserviceApiError(400, 2002, 'Bad players list');
            } else {
                throw e;
            }
        }
    }
}
