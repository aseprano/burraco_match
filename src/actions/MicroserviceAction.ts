import { ApiResponse, MicroserviceApiError } from '@darkbyte/herr';
import { Request } from "express";
import { MatchService } from "../domain/app-services/MatchService";
import { CardSerializer } from "../domain/domain-services/CardSerializer";
import { ActionNotAllowedException } from "../domain/exceptions/ActionNotAllowedException";
import { BadPlayerTurnException } from "../domain/exceptions/BadPlayerTurnException";
import { MatchNotFoundException } from "../domain/exceptions/MatchNotFoundException";
import { PlayerNotFoundException } from "../domain/exceptions/PlayerNotFoundException";
import { Card } from "../domain/value_objects/Card";
import { CardList } from "../domain/value_objects/CardList";
import { MatchID } from "../domain/value_objects/MatchID";
import { PlayerID } from "../domain/value_objects/PlayerID";
import { BaseAction } from "./BaseAction";

const E_BAD_MATCH_ID       = 1001;
const E_MATCH_NOT_FOUND    = 1002;
const E_PLAYER_NOT_FOUND   = 1003;
const E_BAD_TURN           = 1004;
const E_ACTION_NOT_ALLOWED = 1005;

export abstract class MicroserviceAction extends BaseAction {

    constructor(
        protected matchService: MatchService,
        private cardSerializer: CardSerializer
    ) {
        super();
    }

    protected parseCard(card: any): Card {
        return this.cardSerializer.unserializeCard(card);
    }

    protected parseCards(cards: any): CardList {
        return this.cardSerializer.unserializeCards(cards);
    }

    protected serializeCard(card: Card): string {
        return this.cardSerializer.serializeCard(card);
    }

    protected serializeCards(cards: CardList): Array<string> {
        return this.cardSerializer.serializeCards(cards);
    }

    protected getPlayerID(request: Request): PlayerID {
        const userId = request['currentUser'].username;

        console.debug(`Found user id: ${userId}`);

        return new PlayerID(userId);
    }

    protected parseMatchId(request: Request): MatchID {
        const matchId = request.params.match_id;
        console.debug(`Found match_id in request params: ${matchId}`);

        try {
            return new MatchID(parseInt(matchId, 10));
        } catch (e) {
            throw new MicroserviceApiError(404, E_BAD_MATCH_ID, 'Match not found')
        }
    }

    protected requiredParameters(): string[] {
        return [];
    }

    public async handleRequest(request: Request): Promise<ApiResponse> {
        return super.handleRequest(request)
            .catch((error) => {
                console.warn(`Error caught: ${error}`);

                if (error instanceof MatchNotFoundException) {
                    throw new MicroserviceApiError(404, E_MATCH_NOT_FOUND, 'Match not found');
                } else if (error instanceof PlayerNotFoundException) {
                    throw new MicroserviceApiError(403, E_PLAYER_NOT_FOUND, 'Player not found in the match');
                } else if (error instanceof BadPlayerTurnException) {
                    throw new MicroserviceApiError(403, E_BAD_TURN, 'Not your turn to play');
                } else if (error instanceof ActionNotAllowedException) {
                    throw new MicroserviceApiError(403, E_ACTION_NOT_ALLOWED, 'Action not allowed in the current state');
                } else {
                    throw error;
                }
            });
    }

    public abstract serveRequest(request: Request): Promise<ApiResponse>;

}