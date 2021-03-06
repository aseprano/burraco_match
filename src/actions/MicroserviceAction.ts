import { AbstractAction, ApiResponse, BadRequestHTTPError, Context, ContextBindings, ForbiddenHTTPError, Injectable, Logger, NotFoundHTTPError, UnauthorizedHTTPError } from '@darkbyte/herr';
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
const { performance } = require('perf_hooks');

@Injectable()
export abstract class MicroserviceAction extends AbstractAction {

    constructor(
        logger: Logger,
        context: ContextBindings,
        protected readonly matchService: MatchService,
        private readonly cardSerializer: CardSerializer,
    ) {
        super(logger, context);
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

    protected getPlayerId(context: Context): PlayerID {
        return new PlayerID(context.user!.username);
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
        const t0 = performance.now();

        return super.handleRequest(request)
            .catch((error) => {
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
            }).finally(() => {
                const t = performance.now() - t0;
                this.getLogger().debug(() => `Request handled in: ${t} ms`);
            });
    }

    public abstract serveRequest(request: Request, context: Context): Promise<ApiResponse>;

}