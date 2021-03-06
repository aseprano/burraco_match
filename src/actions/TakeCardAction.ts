import { MicroserviceAction } from './MicroserviceAction';
import { Request } from 'express';
import { ApiResponse, BadRequestHTTPError, Context, Injectable, MicroserviceApiResponse } from '@darkbyte/herr';
import { CardList } from '../domain/value_objects/CardList';

/**
 * @summary Makes one player take one card from the stock or the full discard pile
 * @method POST
 * @url /matches/{id}/hand
 * 
 * @get id [integer, required] The id of the match
 * 
 * @parameter from [enum(stock,discard_pile), required] Where the player wants to take the card(s) from
 * 
 * @response cards [array, required] The list of cards taken from the player
 */
@Injectable()
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
            throw new BadRequestHTTPError('Invalid source');
        }

        return from;
    }

    private wantsToTakeFromStock(request: Request): boolean {
        return this.parseFrom(request) === this.STOCK;
    }

    private async doTake(request: Request, context: Context): Promise<CardList> {
        const playerId = this.getPlayerId(context);
        const matchId = this.parseMatchId(request);

        if (this.wantsToTakeFromStock(request)) {
            return this.matchService
                .playerTakesFromStock(matchId, playerId)
                .then((card) => new CardList(card));
        } else {
            return this.matchService
                .playerPicksUpDiscardPile(matchId, playerId);
        }
    }

    public async serveRequest(request: Request, context: Context): Promise<ApiResponse> {
        return this.doTake(request, context)
            .then((cards) => new MicroserviceApiResponse({cards}));
    }

}