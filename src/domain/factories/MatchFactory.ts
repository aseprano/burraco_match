import { PlayerID } from "../value_objects/PlayerID";
import { Match } from "../entities/Match";
import { Team } from "../value_objects/Team";

export interface MatchFactory {

    createNew(): Promise<Match>;

}