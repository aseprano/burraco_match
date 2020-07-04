import { MatchService } from "../MatchService";
import { MatchID } from "../../value_objects/MatchID";
import { PlayerID } from "../../value_objects/PlayerID";
import { Team } from "../../value_objects/Team";
import { MatchFactory } from "../../factories/MatchFactory";

export class ConcreteMatchService implements MatchService {

    constructor(private factory: MatchFactory) {}

    public async start1v1(gameId: number, player1: PlayerID, player2: PlayerID): Promise<MatchID> {
        const match = await this.factory.createNew(gameId);
        match.start1vs1(player1, player2);

        throw new Error('Method not implemented');
    }

    public async start2v2(gameId: number, team1: Team, team2: Team): Promise<MatchID> {
        throw new Error('Method not implemented');
    } 
    
}