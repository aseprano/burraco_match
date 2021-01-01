import { MatchService } from "../MatchService";
import { MatchID } from "../../value_objects/MatchID";
import { PlayerID } from "../../value_objects/PlayerID";
import { Team } from "../../value_objects/Team";
import { MatchFactory } from "../../factories/MatchFactory";
import { Card } from "../../value_objects/Card";
import { CardList } from "../../value_objects/CardList";
import { RunID } from "../../value_objects/RunID";
import { MatchesRepository } from "../../repositories/MatchesRepository";
import { Match } from "../../entities/Match";
import { Run } from "../../entities/Run";

export class ConcreteMatchService extends MatchService {

    constructor(
        private readonly factory: MatchFactory,
        private readonly repository: MatchesRepository
    ) {
        super();
    }

    private async runInMatch(matchId: MatchID, callback: (match: Match) => any): Promise<any> {
        return this.repository
            .getById(matchId)
            .then((match) => {
                const ret = callback(match);

                return this.repository
                    .update(match)
                    .then(() => ret);
            });
    }

    public async start1v1(gameId: number, player1: PlayerID, player2: PlayerID): Promise<MatchID> {
        const match = await this.factory.createInitialized();
        match.start1vs1(gameId, player1, player2);
        await this.repository.add(match);
        return match.getId();
    }

    public async start2v2(gameId: number, team1: Team, team2: Team): Promise<MatchID> {
        const match = await this.factory.createInitialized();
        match.start2vs2(gameId, team1, team2);
        await this.repository.add(match);
        return match.getId();
    } 
    
    public async playerTakesFromStock(matchId: MatchID, player: PlayerID): Promise<Card> {
        return this.runInMatch(
            matchId,
            match => match.takeFromStock(player)
        );
    }

    public async playerPicksUpDiscardPile(matchId: MatchID, player: PlayerID): Promise<CardList> {
        return this.runInMatch(
            matchId,
            match => match.pickUpDiscardPile(player)
        );
    }

    public async playerCreatesRun(matchId: MatchID, player: PlayerID, cards: CardList): Promise<Run> {
        return this.runInMatch(
            matchId,
            match => match.createRun(player, cards)
        );
    }

    public async playerMeldsCardsToExistingRun(matchId: MatchID, player: PlayerID, cards: CardList, runId: RunID): Promise<Run> {
        return this.runInMatch(
            matchId,
            match => match.meldCardsToRun(player, cards, runId)
        );
    }

    public async playerThrowsCardToDiscardPile(matchId: MatchID, player: PlayerID, card: Card): Promise<void> {
        return this.runInMatch(
            matchId,
            match => match.throwCardToDiscardPile(player, card)
        );
    }
}