import { MatchService } from "../../domain/app-services/MatchService";
import { CardSerializer } from "../../domain/domain-services/CardSerializer";
import { ApiResponse } from "../../tech/api/ApiResponse";
import { AbstractAction } from "./AbstractAction";

export class CreateRunAction extends AbstractAction {

    constructor(
        matchService: MatchService,
        cardSerializer: CardSerializer
    ) {
        super(matchService, cardSerializer);
    }

    public serveRequest(): Promise<ApiResponse> {
        throw new Error("Method not implemented.");
    }

}