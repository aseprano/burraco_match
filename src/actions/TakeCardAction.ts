import { MicroserviceAction } from './MicroserviceAction';
import { Request } from 'express';
import { ApiResponse, MicroserviceApiError, MicroserviceApiResponse } from '@darkbyte/herr';

/**
 * @summary Makes one player take one card from the stock or the full discard pile
 * @method POST
 * @url /matches/{id}/hand
 * 
 * @get id [integer, required] The id of the match
 * 
 * @parameter from [enum(stock,discard_pile)] Where the player wants to take the card(s) from
 * 
 * @status 2001 Invalid source
 * @status 2002 Invalid player turn
 * @status 2003 Action not allowed in the current state
 */
export class TakeCardAction extends MicroserviceAction {
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

    private parseFrom(request: Request): string {
        const from: any = request.body.from;

        if (typeof from !== 'string' || !this.isValidSource(from)) {
            throw new MicroserviceApiError(400, 2001, 'Invalid source');
        }

        return from;
    }

    private wantsToTakeFromStock(request: Request): boolean {
        return this.parseFrom(request) === this.STOCK;
    }

    public async serveRequest(request: Request): Promise<ApiResponse> {
        const playerId = this.getPlayerID(request);
        const matchId = this.parseMatchId(request);
        
        if (this.wantsToTakeFromStock(request)) {
            const card = await this.matchService.playerTakesFromStock(matchId, playerId);
            return new MicroserviceApiResponse({card: this.serializeCard(card)});
        } else {
            const cards = await this.matchService.playerPicksUpDiscardPile(matchId, playerId);
            return new MicroserviceApiResponse({cards: this.serializeCards(cards)});
        }
    }

}