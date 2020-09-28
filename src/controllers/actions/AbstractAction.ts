import { Request, response } from "express";
import { MatchService } from "../../domain/app-services/MatchService";
import { CardSerializer } from "../../domain/domain-services/CardSerializer";
import { PlayerNotFoundException } from "../../domain/exceptions/PlayerNotFoundException";
import { Card } from "../../domain/value_objects/Card";
import { CardList } from "../../domain/value_objects/CardList";
import { MatchID } from "../../domain/value_objects/MatchID";
import { PlayerID } from "../../domain/value_objects/PlayerID";
import { ApiResponse } from "../../tech/api/ApiResponse";
import { ForbiddenApiResponse } from "../../tech/api/ForbiddenApiResponse";
import { BaseController } from "../BaseController";
import { MicroserviceApiError } from "../MicroserviceApiError";

const E_BAD_PLAYER_ID    = 1002;
const E_BAD_MATCH_ID     = 1003;
const E_MATCH_NOT_FOUND  = 1004;
const E_PLAYER_NOT_FOUND = 1005;

export abstract class AbstractAction extends BaseController {

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

    protected getPlayerID(): PlayerID {
        const userId = this.request.currentUser.username;

        console.debug(`Found user id: ${userId}`);

        return new PlayerID(userId);
    }

    protected parseMatchId(): MatchID {
        const matchId = this.request.params.match_id;
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

    protected matchNotFoundError(): MicroserviceApiError {
        return new MicroserviceApiError(404, E_MATCH_NOT_FOUND, 'Match not found');
    }

    public async run(req: Request): Promise<ApiResponse> {
        return super.run(req)
            .catch((error) => {
                if (error instanceof PlayerNotFoundException) {
                    return new ForbiddenApiResponse();
                } else {
                    throw error;
                }
            });
    }

    public async abstract serveRequest(): Promise<ApiResponse>;

}