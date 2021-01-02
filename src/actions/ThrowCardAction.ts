import { MicroserviceAction } from './MicroserviceAction';
import { MatchService } from "../domain/app-services/MatchService";
import { CardSerializer } from "../domain/domain-services/CardSerializer";
import { CannotThrowCardException } from "../domain/exceptions/CannotThrowCardException";
import { CardNotOwnedException } from "../domain/exceptions/CardNotOwnedException";
import { Card } from "../domain/value_objects/Card";
import { Request } from 'express';
import { ApiResponse, MicroserviceApiError, MicroserviceApiResponse } from '@darkbyte/herr';

export class ThrowCardAction extends MicroserviceAction {

    constructor(
        matchService: MatchService,
        serializer: CardSerializer
    ) {
        super(matchService, serializer);
    }

    private getCard(request: Request): Card {
        try {
            return this.parseCard(request.body.card);
        } catch (error) {
            throw new MicroserviceApiError(2001, 400, 'Not a card');
        }
    }

    public requiredParameters(): Array<string> {
        return ['card'];
    }

    public async serveRequest(request: Request): Promise<ApiResponse> {
        const matchId = this.parseMatchId(request);
        const card = this.getCard(request);

        return this.matchService
            .playerThrowsCardToDiscardPile(
                matchId,
                this.getPlayerId(request),
                card
            ).then(() => {
                return new MicroserviceApiResponse({
                    card: this.serializeCard(card)
                });
            }).catch((error) => {
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