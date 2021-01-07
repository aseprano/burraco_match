import { ApiResponse, Injectable, MicroserviceApiError, MicroserviceApiResponse, NotFoundHTTPError } from '@darkbyte/herr';
import { Request } from 'express';
import { CardNotOwnedException } from "../domain/exceptions/CardNotOwnedException";
import { RunException } from "../domain/exceptions/RunException";
import { RunNotFoundException } from "../domain/exceptions/RunNotFoundException";
import { MicroserviceAction } from './MicroserviceAction';

/**
 * @summary Adds some cards to an existing run
 * @method POST
 * @url /matches/{id}/runs/{id_run}
 * 
 * @get id [integer, required] The id of the match
 * @get id_run [integer, required] The id of the run
 * 
 * @parameter cards [array<Card>, required] The list of cards to tadd to the run
 * 
 * @status 2001 Cards not owned
 * @status 2003 Cannot add the provided cards to the run
 */
@Injectable()
export class AddCardsToRunAction extends MicroserviceAction {

    public requiredParameters(): Array<string> {
        return [
            'cards'
        ];
    }

    public serveRequest(request: Request): Promise<ApiResponse> {
        return this.matchService
            .playerMeldsCardsToExistingRun(
                this.parseMatchId(request),
                this.getPlayerId(request),
                this.parseCards(request.body.cards),
                this.parseRunID(request)
            ).then((newRun) => new MicroserviceApiResponse({
                id: newRun.getId(),
                cards: this.serializeCards(newRun.getCards())
            })).catch((error) => {
                if (error instanceof RunNotFoundException) {
                    throw new NotFoundHTTPError('Run not found');
                } else if (error instanceof CardNotOwnedException) {
                    throw new MicroserviceApiError(400, 2001, 'Card not owned');
                } else if (error instanceof RunException) {
                    throw new MicroserviceApiError(400, 2002, 'Cannot add the provided cards to the run');
                } else {
                    throw error;
                }
            });
    }

}