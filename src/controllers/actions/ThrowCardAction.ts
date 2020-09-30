import e from "express";
import { MatchService } from "../../domain/app-services/MatchService";
import { CardSerializer } from "../../domain/domain-services/CardSerializer";
import { CannotThrowCardException } from "../../domain/exceptions/CannotThrowCardException";
import { CardNotOwnedException } from "../../domain/exceptions/CardNotOwnedException";
import { Card } from "../../domain/value_objects/Card";
import { ApiResponse } from "../../tech/api/ApiResponse";
import { MicroserviceApiError } from "../MicroserviceApiError";
import { MicroserviceApiResponse } from "../MicroserviceApiResponse";
import { AbstractAction } from "./AbstractAction";

export class ThrowCardAction extends AbstractAction {

    constructor(
        matchService: MatchService,
        serializer: CardSerializer
    ) {
        super(matchService, serializer);
    }

    private getCard(): Card {
        try {
            return this.parseCard(this.request.body.card);
        } catch (error) {
            throw new MicroserviceApiError(2001, 400, 'Not a card');
        }
    }

    public requiredParameters(): Array<string> {
        return ['card'];
    }

    public async serveRequest(): Promise<ApiResponse> {
        const matchId = this.parseMatchId();
        const card = this.getCard();

        return this.matchService
            .playerThrowsCardToDiscardPile(
                matchId,
                this.getPlayerID(),
                card
            ).then(() => {
                return new MicroserviceApiResponse();
            }).catch((error) => {
                console.debug(`Found error: ${error.constructor.name}`);

                if (error instanceof CardNotOwnedException) {
                    throw new MicroserviceApiError(2002, 409, 'Card not owned');
                } else if (error instanceof CannotThrowCardException) {
                    throw new MicroserviceApiError(2003, 409, 'Cannot throw the last card taken from the discard pile');
                } else {
                    throw error;
                }
            });
    }

}