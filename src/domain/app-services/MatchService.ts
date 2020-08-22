import { PlayerID } from "../value_objects/PlayerID";
import { MatchID } from "../value_objects/MatchID";
import { Team } from "../value_objects/Team";
import { Card, CardList } from "../value_objects/Card";

export interface MatchService {

    /**
     * @param gameId 
     * @param player1 
     * @param player2 
     * @throws MatchPlayersException
     */
    start1v1(gameId: number, player1: PlayerID, player2: PlayerID): Promise<MatchID>;

    /**
     * @param gameId 
     * @param team1 
     * @param team2 
     * @throws MatchPlayersException
     */
    start2v2(gameId: number, team1: Team, team2: Team): Promise<MatchID>;

    /**
     * @param matchId 
     * @param player 
     * @throws MatchNotFoundException
     * @throws BadPlayerTurnException
     * @throws ActionNotAllowedException
     */
    playerTakesFromStock(matchId: MatchID, player: PlayerID): Promise<Card>;

    /**
     * @param matchId 
     * @param player 
     * @throws MatchNotFoundException
     * @throws BadPlayerTurnException
     * @throws ActionNotAllowedException
     */
    playerPicksUpDiscardPile(matchId: MatchID, player: PlayerID): Promise<CardList>;

}