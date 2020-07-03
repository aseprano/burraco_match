import { PlayerID } from "./PlayerID";
import { BadTeamException } from "../exceptions/BadTeamException";

export class Team {

    /**
     * @param player1 
     * @param player2 
     * @throws BadTeamException
     */
    constructor(private player1: PlayerID, private player2: PlayerID) {
        if (player1.equals(player2)) {
            throw new BadTeamException();
        }
    }

    public getPlayer1(): PlayerID {
        return this.player1;
    }

    public getPlayer2(): PlayerID {
        return this.player2;
    }

}