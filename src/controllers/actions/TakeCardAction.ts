import { AbstractAction } from "./AbstractAction";
import { ApiResponse } from "../../tech/api/ApiResponse";
import { MicroserviceApiResponse } from "../MicroserviceApiResponse";
import { MicroserviceApiError } from "../MicroserviceApiError";
import { MatchNotFoundException } from "../../domain/exceptions/MatchNotFoundException";
import { PlayerNotFoundException } from "../../domain/exceptions/PlayerNotFoundException";
import { BadPlayerTurnException } from "../../domain/exceptions/BadPlayerTurnException";
import { ForbiddenApiResponse } from "../../tech/api/ForbiddenApiResponse";
import { ActionNotAllowedException } from "../../domain/exceptions/ActionNotAllowedException";

/**
 * @summary Makes one player take one card from the stock or the full discard pile
 * @method POST
 * @url /matches/{id}/players/{player}/hand
 * 
 * @get id [integer, required] The id of the match
 * @get player [string, required] The id of the player that wants to take the card(s)
 * 
 * @parameter from [enum(stock,discard_pile)] Where the player wants to take the card(s) from
 * 
 * @status 2001 Invalid source
 * @status 2002 Invalid player turn
 * @status 2003 Action not allowed in the current state
 */
export class TakeCardAction extends AbstractAction {
    private readonly STOCK = 'stock';
    private readonly DISCARD_PILE = 'discard_pile';

    private validSources = [this.STOCK, this.DISCARD_PILE];

    public requiredParameters(): string[] {
        return [
            'from'
        ];
    }

    private isValidSource(from: string): boolean {
        return this.validSources.includes(from);
    }

    private parseFrom(): string {
        const from = this.request.body.from;

        if (typeof from !== 'string' || !this.isValidSource(from)) {
            throw new MicroserviceApiError(400, 2001, 'Invalid source');
        }

        return from;
    }

    private wantsToTakeFromStock(): boolean {
        return this.parseFrom() === this.STOCK;
    }

    public async serveRequest(): Promise<ApiResponse> {
        const playerId = this.parsePlayerId();
        const matchId = this.parseMatchId();

        try {
            if (this.wantsToTakeFromStock()) {
                const card = await this.matchService.playerTakesFromStock(matchId, playerId);
                return new MicroserviceApiResponse({card: this.serializeCard(card)});
            } else {
                const cards = await this.matchService.playerPicksUpDiscardPile(matchId, playerId);
                return new MicroserviceApiResponse({cards: this.serializeCards(cards)});
            }
        } catch (error) {
            if (error instanceof MatchNotFoundException) {
                throw this.matchNotFoundError();
            } else if (error instanceof PlayerNotFoundException) {
                throw this.playerNotFoundError();
            } else if (error instanceof BadPlayerTurnException) {
                throw new ForbiddenApiResponse({'error': 'Not the player turn to play'});
            } else if (error instanceof ActionNotAllowedException) {
                throw new MicroserviceApiError(400, 2003, 'Action not allowed in the current state');
            } else {
                throw error;
            }
        }
    }

}