import { MatchService } from "../../domain/app-services/MatchService";
import { CardSerializer } from "../../domain/domain-services/CardSerializer";
import { Card } from "../../domain/value_objects/Card";
import { CardList } from "../../domain/value_objects/CardList";
import { MatchID } from "../../domain/value_objects/MatchID";
import { PlayerID } from "../../domain/value_objects/PlayerID";
import { ApiResponse } from "../../tech/api/ApiResponse";
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

    protected parsePlayerId(): PlayerID {
        const playerId = this.request.params.player_id;
        console.debug(`Found player_id in request params: ${playerId}`);
        
        try {
            return new PlayerID(playerId);
        } catch (error) {
            throw new MicroserviceApiError(400, E_BAD_PLAYER_ID, `Bad player: ${playerId}`);
        }
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

    protected playerNotFoundError(): MicroserviceApiError {
        return new MicroserviceApiError(404, E_PLAYER_NOT_FOUND, 'Player not found');
    }

    public async abstract serveRequest(): Promise<ApiResponse>;

}