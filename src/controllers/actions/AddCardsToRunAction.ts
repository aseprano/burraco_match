import { CardNotOwnedException } from "../../domain/exceptions/CardNotOwnedException";
import { RunException } from "../../domain/exceptions/RunException";
import { RunNotFoundException } from "../../domain/exceptions/RunNotFoundException";
import { RunID } from "../../domain/value_objects/RunID";
import { ApiResponse } from "../../tech/api/ApiResponse";
import { NotFoundApiResponse } from "../../tech/api/NotFoundApiResponse";
import { MicroserviceApiError } from "../MicroserviceApiError";
import { MicroserviceApiResponse } from "../MicroserviceApiResponse";
import { AbstractAction } from "./AbstractAction";

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
export class AddCardsToRunAction extends AbstractAction {

    private getRunId(): RunID {
        return new RunID(parseInt(this.request.params['run_id'], 10));
    }

    public requiredParameters(): Array<string> {
        return [
            'cards'
        ];
    }

    public serveRequest(): Promise<ApiResponse> {
        return this.matchService
            .playerMeldsCardsToExistingRun(
                this.parseMatchId(),
                this.getPlayerID(),
                this.parseCards(this.request.body.cards),
                this.getRunId()
            ).then((newRun) => new MicroserviceApiResponse({
                id: newRun.getId(),
                cards: this.serializeCards(newRun.getCards())
            })).catch((error) => {
                if (error instanceof RunNotFoundException) {
                    throw new NotFoundApiResponse('Run not found');
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