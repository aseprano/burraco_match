import { MatchID } from "../value_objects/MatchID";
import { Match } from "../entities/Match";

export interface MatchesRepository {

    /**
     * @param id
     * @returns Match
     * @throws MatchNotFoundException
     */
    getById(id: MatchID): Promise<Match>;

    add(match: Match): Promise<void>;

    update(match: Match): Promise<void>;
    
}