import { CardNotOwnedException } from "../domain/exceptions/CardNotOwnedException";
import { RunException } from "../domain/exceptions/RunException";
import { CardList } from "../domain/value_objects/CardList";
import { MicroserviceAction } from "./MicroserviceAction";
import { Request } from "express";
import { ApiResponse, MicroserviceApiError, MicroserviceApiResponse } from '@darkbyte/herr';

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
                this.getPlayerID(request),
                this.getCards(request)
            ).then((run) => new MicroserviceApiResponse({
                    run: {
                        id: run.getId(),
                        cards: this.serializeCards(run.getCards()),
                    }
                })
            ).catch((error) => {
                if (error instanceof CardNotOwnedException) {
                    throw new MicroserviceApiError(400, 2002, 'Card not owned');
                } else if (error instanceof RunException) {
                    throw new MicroserviceApiError(400, 2003, 'Cannot create a run using the provided cards');
                } else {
                    throw error;
                }
            });
    }

}