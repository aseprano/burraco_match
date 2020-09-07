import { MatchService } from "../MatchService";
import { MatchID } from "../../value_objects/MatchID";
import { PlayerID } from "../../value_objects/PlayerID";
import { Team } from "../../value_objects/Team";
import { MatchFactory } from "../../factories/MatchFactory";
import { Card, CardList } from "../../value_objects/Card";
import { RunID } from "../../value_objects/RunID";

export class ConcreteMatchService implements MatchService {

    constructor(private factory: MatchFactory) {}

    public async start1v1(gameId: number, player1: PlayerID, player2: PlayerID): Promise<MatchID> {
        const match = await this.factory.createInitialized();
        match.start1vs1(gameId, player1, player2);
        return match.getId();
    }

    public async start2v2(gameId: number, team1: Team, team2: Team): Promise<MatchID> {
        const match = await this.factory.createInitialized();
        match.start2vs2(gameId, team1, team2);
        return match.getId();
    } 
    
    public async playerTakesFromStock(matchId: MatchID, player: PlayerID): Promise<Card> {
        throw new Error("Method not implemented.");
    }

    public async playerPicksUpDiscardPile(matchId: MatchID, player: PlayerID): Promise<CardList> {
        throw new Error("Method not implemented.");
    }

    public async playerCreatesRun(matchId: MatchID, player: PlayerID, cards: CardList): Promise<import("../../entities/Run").Run> {
        throw new Error("Method not implemented.");
    }

    public async playerMeldsCardsToExistingRun(matchId: MatchID, player: PlayerID, cards: CardList, runId: RunID): Promise<import("../../entities/Run").Run> {
        throw new Error("Method not implemented.");
    }

    public async playerThrowsCardToDiscardPile(matchId: MatchID, player: PlayerID, card: Card): Promise<void> {
        throw new Error("Method not implemented.");
    }
}