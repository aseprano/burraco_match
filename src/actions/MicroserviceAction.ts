import { ApiResponse, BadRequestHTTPError, ForbiddenHTTPError, MicroserviceApiError, NotFoundHTTPError, UnauthorizedHTTPError } from '@darkbyte/herr';
import { Request } from "express";
import { MatchService } from "../domain/app-services/MatchService";
import { CardSerializer } from "../domain/domain-services/CardSerializer";
import { ActionNotAllowedException } from "../domain/exceptions/ActionNotAllowedException";
import { BadPlayerTurnException } from "../domain/exceptions/BadPlayerTurnException";
import { BadRunIdException } from '../domain/exceptions/BadRunIdException';
import { MatchNotFoundException } from "../domain/exceptions/MatchNotFoundException";
import { PlayerNotFoundException } from "../domain/exceptions/PlayerNotFoundException";
import { Card } from "../domain/value_objects/Card";
import { CardList } from "../domain/value_objects/CardList";
import { MatchID } from "../domain/value_objects/MatchID";
import { PlayerID } from "../domain/value_objects/PlayerID";
import { RunID } from '../domain/value_objects/RunID';
import { BaseAction } from "./BaseAction";

export abstract class MicroserviceAction extends BaseAction {

    constructor(
        protected matchService: MatchService,
        private cardSerializer: CardSerializer
    ) {
        super();
    }

    protected parseRunID(request: Request): RunID {
        try {
            return new RunID(parseInt(request.params.run_id, 10));
        } catch (error) {
            if (error instanceof BadRunIdException) {
                throw new NotFoundHTTPError('Run not found');
            } else {
                throw error;
            }
        }
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

    protected getPlayerId(request: Request): PlayerID {
        const userId = request['currentUser'].username as string;

        console.debug(`Found user id: ${userId}`);

        return new PlayerID(userId);
    }

    protected parseMatchId(request: Request): MatchID {
        const matchId = request.params.match_id;

        try {
            return new MatchID(parseInt(matchId, 10));
        } catch (e) {
            throw new NotFoundHTTPError('Match not found')
        }
    }

    protected parseGameId(request: Request): number {
        const gameId = request.body.game_id;

        if (typeof gameId !== 'number') {
            throw new BadRequestHTTPError('Invalid game id');
        }

        return gameId;
    }

    protected parsePlayers(request: Request): Array<PlayerID> {
        const players = request.body.players;

        if (!Array.isArray(players)) {
            throw new BadRequestHTTPError('Invalid players list');
        }

        try {
            return players.map((playerId) => new PlayerID(playerId));
        } catch (error) {
            throw new BadRequestHTTPError('Invalid players list');
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
                    throw new NotFoundHTTPError('Match not found');
                } else if (error instanceof PlayerNotFoundException) {
                    throw new UnauthorizedHTTPError('Player not found in the match');
                } else if (error instanceof BadPlayerTurnException) {
                    throw new ForbiddenHTTPError('Not your turn to play');
                } else if (error instanceof ActionNotAllowedException) {
                    throw new ForbiddenHTTPError('Action not allowed in the current state');
                } else {
                    throw error;
                }
            });
    }

    public abstract serveRequest(request: Request): Promise<ApiResponse>;

}