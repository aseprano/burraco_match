import { MicroserviceAction } from './MicroserviceAction';
import { CannotThrowCardException } from "../domain/exceptions/CannotThrowCardException";
import { CardNotOwnedException } from "../domain/exceptions/CardNotOwnedException";
import { Card } from "../domain/value_objects/Card";
import { Request } from 'express';
import { ApiResponse, Context, Injectable, MicroserviceApiError, MicroserviceApiResponse } from '@darkbyte/herr';

@Injectable()
export class ThrowCardAction extends MicroserviceAction {

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

    public async serveRequest(request: Request, context: Context): Promise<ApiResponse> {
        const matchId = this.parseMatchId(request);
        const card = this.getCard(request);

        return this.matchService
            .playerThrowsCardToDiscardPile(
                matchId,
                this.getPlayerId(context),
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