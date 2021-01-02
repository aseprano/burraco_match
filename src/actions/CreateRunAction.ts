import { MicroserviceAction } from "./MicroserviceAction";
import { ApiResponse, MicroserviceApiError, MicroserviceApiResponse } from '@darkbyte/herr';
import { Request } from "express";
import { CardNotOwnedException } from "../domain/exceptions/CardNotOwnedException";
import { RunException } from "../domain/exceptions/RunException";
import { CardList } from "../domain/value_objects/CardList";

/**
 * @summary Creates a run
 * @method POST
 * @url /matches/{id}/runs
 * 
 * @get id [integer, required] The id of the match
 * 
 * @parameter cards [array<Card>, required] The list of cards to use for creating the new run
 * 
 * @status 2001 Card not owned
 * @status 2002 Cannot create a run using the provided cards
 */
export class CreateRunAction extends MicroserviceAction {

    private getCards(request: Request): CardList {
        try {
            return this.parseCards(request.body.cards);
        } catch (error) {
            throw new MicroserviceApiError(2001, 400, 'Invalid card list');
        }
    }

    public requiredParameters(): Array<string> {
        return ['cards'];
    }

    public async serveRequest(request: Request): Promise<ApiResponse> {
        return this.matchService
            .playerCreatesRun(
                this.parseMatchId(request),
                this.getPlayerId(request),
                this.getCards(request)
            ).then((run) => new MicroserviceApiResponse({
                run: {
                    id: run.getId(),
                    cards: this.serializeCards(run.getCards()),
                }
            })).catch((error) => {
                if (error instanceof CardNotOwnedException) {
                    throw new MicroserviceApiError(400, 2001, 'Card not owned');
                } else if (error instanceof RunException) {
                    throw new MicroserviceApiError(400, 2002, 'Cannot create a run using the provided cards');
                } else {
                    throw error;
                }
            });
    }

}