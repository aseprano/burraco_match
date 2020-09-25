import { AbstractAction } from "./AbstractAction";
import { ApiResponse } from "../../tech/api/ApiResponse";
import { MicroserviceApiError } from "../MicroserviceApiError";
import { MicroserviceApiResponse } from "../MicroserviceApiResponse";

import { BadPlayerIDException } from "../../domain/exceptions/BadPlayerIDException";
import { MatchPlayersException } from "../../domain/exceptions/MatchPlayersException";
import { PlayerID } from "../../domain/value_objects/PlayerID";
import { Team } from "../../domain/value_objects/Team";

export class CreateMatchAction extends AbstractAction {

    private parseGameId(): number {
        const gameId = this.request.body.game_id;

        if (!(typeof gameId === 'number')) {
            throw new MicroserviceApiError(400, 1002, 'Invalid game id');
        }

        return gameId;
    }

    private parsePlayers(): Array<PlayerID> {
        const players = this.request.body.players;

        if (!Array.isArray(players)) {
            throw new MicroserviceApiError(400, 1003, 'Bad players format');
        }

        return players.map((playerId) => new PlayerID(playerId));
    }
    
    public requiredParameters(): string[] {
        return [
            'game_id',
            'players',
        ];
    }

    /**
     * @summary Creates a new match
     * @method POST
     * @url /matches
     * 
     * @parameter players [array[PlayerID], required] The list of player, starting from NORTH, clockwise
     * @parameter game_id [number, required] The id of the game that the match belongs to
     * 
     * @status 1002 Invalid game id
     * @status 1003 Bad players format
     * @status 1004 Invalid number of players
     * @status 1005 Duplicated players
     */
    public async serveRequest(): Promise<ApiResponse> {
        const gameId = this.parseGameId();
        const players = this.parsePlayers();

        if (players.length !== 2 && players.length !== 4) {
            return new MicroserviceApiError(400, 1004, 'Invalid number of players');
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
                return new MicroserviceApiError(400, 1003, 'Bad players format');
            } else if (e instanceof BadPlayerIDException) {
                return new MicroserviceApiError(400, 1005, 'Duplicated players')
            } else {
                throw e;
            }
        }
    }
}
