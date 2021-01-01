import { PlayerID } from "../value_objects/PlayerID";
import { MatchID } from "../value_objects/MatchID";
import { Team } from "../value_objects/Team";
import { Card } from "../value_objects/Card";
import { CardList } from "../value_objects/CardList";
import { Run } from "../entities/Run";
import { RunID } from "../value_objects/RunID";
import { Injectable } from '@darkbyte/herr';

@Injectable()
export abstract class MatchService {

    /**
     * @param gameId
     * @param player1
     * @param player2
     * @throws MatchPlayersException
     */
    public abstract start1v1(gameId: number, player1: PlayerID, player2: PlayerID): Promise<MatchID>;

    /**
     * @param gameId
     * @param team1
     * @param team2
     * @throws MatchPlayersException
     */
    public abstract start2v2(gameId: number, team1: Team, team2: Team): Promise<MatchID>;

    /**
     * @param matchId
     * @param player
     * @throws MatchNotFoundException
     * @throws PlayerNotFoundException
     * @throws BadPlayerTurnException
     * @throws ActionNotAllowedException
     */
    public abstract playerTakesFromStock(matchId: MatchID, player: PlayerID): Promise<Card>;

    /**
     * @param matchId
     * @param player
     * @throws MatchNotFoundException
     * @throws BadPlayerTurnException
     * @throws ActionNotAllowedException
     */
    public abstract playerPicksUpDiscardPile(matchId: MatchID, player: PlayerID): Promise<CardList>;

    /**
     * @param matchId
     * @param player
     * @param cards
     * @throws MatchNotFoundException
     * @throws BadPlayerTurnException
     * @throws ActionNotAllowedException
     * @throws CardNotOwnedException
     * @throws RunException
     */
    public abstract playerCreatesRun(matchId: MatchID, player: PlayerID, cards: CardList): Promise<Run>;

    /**
     * @param matchId
     * @param player
     * @param cards
     * @param runId
     * @throws MatchNotFoundException
     * @throws BadPlayerTurnException
     * @throws ActionNotAllowedException
     * @throws CardNotOwnedException
     * @throws RunNotFoundException
     * @throws RunException
     */
    public abstract playerMeldsCardsToExistingRun(matchId: MatchID, player: PlayerID, cards: CardList, runId: RunID): Promise<Run>;

    /**
     * @param matchId
     * @param player
     * @param card
     * @throws MatchNotFoundException
     * @throws BadPlayerTurnException
     * @throws ActionNotAllowedException
     * @throws CardNotOwnedException
     * @throws RunNotFoundException
     * @throws RunException
     */
    public abstract playerThrowsCardToDiscardPile(matchId: MatchID, player: PlayerID, card: Card): Promise<void>;

}