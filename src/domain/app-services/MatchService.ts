import { PlayerID } from "../value_objects/PlayerID";
import { MatchID } from "../value_objects/MatchID";
import { Team } from "../value_objects/Team";

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

    playerPicksFromStock(matchId: MatchID, player: PlayerID): void;

    playerTakesDiscardPile(matchId: MatchID, player: PlayerID): void;

}