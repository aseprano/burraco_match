import { MatchID } from "../value_objects/MatchID";
import { Match } from "../entities/Match";

export abstract class MatchesRepository {

    /**
     * @param id
     * @returns Match
     * @throws MatchNotFoundException
     */
    public abstract getById(id: MatchID): Promise<Match>;

    public abstract add(match: Match): Promise<void>;

    public abstract update(match: Match): Promise<void>;
    
}