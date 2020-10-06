import { CardNotOwnedException } from "../../domain/exceptions/CardNotOwnedException";
import { RunException } from "../../domain/exceptions/RunException";
import { CardList } from "../../domain/value_objects/CardList";
import { ApiResponse } from "../../tech/api/ApiResponse";
import { MicroserviceApiError } from "../MicroserviceApiError";
import { MicroserviceApiResponse } from "../MicroserviceApiResponse";
import { AbstractAction } from "./AbstractAction";

export class CreateRunAction extends AbstractAction {

    private getCards(): CardList {
        try {
            return this.parseCards(this.request.body.cards);
        } catch (error) {
            throw new MicroserviceApiError(2001, 400, 'Invalid card list');
        }
    }

    public requiredParameters(): Array<string> {
        return ['cards'];
    }

    public async serveRequest(): Promise<ApiResponse> {
        return this.matchService
            .playerCreatesRun(
                this.parseMatchId(),
                this.getPlayerID(),
                this.getCards()
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