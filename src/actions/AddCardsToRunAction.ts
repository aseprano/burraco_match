import { ApiResponse, MicroserviceApiError, MicroserviceApiResponse, NotFoundHTTPError } from '@darkbyte/herr';
import { Request } from 'express';
import { MatchService } from '../domain/app-services/MatchService';
import { CardNotOwnedException } from "../domain/exceptions/CardNotOwnedException";
import { RunException } from "../domain/exceptions/RunException";
import { RunNotFoundException } from "../domain/exceptions/RunNotFoundException";
import { RunID } from "../domain/value_objects/RunID";
import { BaseAction } from './BaseAction';

/**
 * @summary Creates a new match
 * @method POST
 * @url /matches/{id}/runs/{id_run}/cards
 * 
 * @parameter players [array[PlayerID], required] The list of player, starting from NORTH, clockwise
 * @parameter game_id [number, required] The id of the game that the match belongs to
 * 
 * @status 2001 Invalid game id
 * @status 2002 Bad players format
 * @status 2003 Invalid number of players
 * @status 2004 Duplicated players
 */
export class AddCardsToRunAction extends BaseAction {

    constructor(
        private readonly matchService: MatchService
    ) {
        super();
    }

    private getRunIdFromRequest(request: Request): RunID {
        return new RunID(parseInt(request.params.run_id, 10));
    }

    public requiredParameters(): Array<string> {
        return [
            'cards'
        ];
    }

    public serveRequest(request: Request): Promise<ApiResponse> {
        return this.matchService
            .playerMeldsCardsToExistingRun(
                this.parseMatchId(),
                this.getPlayerID(),
                this.parseCards(request.body.cards),
                this.getRunId()
            ).then((newRun) => new MicroserviceApiResponse({
                id: newRun.getId(),
                cards: this.serializeCards(newRun.getCards())
            })).catch((error) => {
                if (error instanceof RunNotFoundException) {
                    throw new NotFoundHTTPError('Run not found');
                } else if (error instanceof CardNotOwnedException) {
                    throw new MicroserviceApiError(400, 2002, 'Card not owned');
                } else if (error instanceof RunException) {
                    throw new MicroserviceApiError(400, 2003, 'Cannot add the provided cards to the run');
                } else {
                    throw error;
                }
            });
    }

}