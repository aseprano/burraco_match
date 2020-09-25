import { MatchService } from "../domain/app-services/MatchService";
import { CardSerializer } from "../domain/domain-services/CardSerializer";
import { Card } from "../domain/value_objects/Card";
import { CardList } from "../domain/value_objects/CardList";
import { MatchID } from "../domain/value_objects/MatchID";
import { PlayerID } from "../domain/value_objects/PlayerID";
import { ApiResponse } from "../tech/api/ApiResponse";
import { BaseController } from "./BaseController";

export abstract class AbstractAction extends BaseController {

    constructor(
        protected matchService: MatchService,
        private cardSerializer: CardSerializer
    ) {
        super();
    }

    protected parseMatchId(): MatchID {
        return new MatchID(this.request.body.match_id);
    }

    protected parseCard(card: any): Card {
        return this.cardSerializer.unserializeCard(card);
    }

    protected parseCards(cards: any): CardList {
        return this.cardSerializer.unserializeCards(cards);
    }

    protected parsePlayerId(): PlayerID {
        return new PlayerID(this.request.body.player_id);
    }

    protected requiredParameters(): string[] {
        return [];
    }

    public async abstract serveRequest(): Promise<ApiResponse>;

}