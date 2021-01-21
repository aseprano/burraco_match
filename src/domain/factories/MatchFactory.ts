import { Injectable } from '@darkbyte/herr';
import { Match } from "../entities/Match";

@Injectable()
export abstract class MatchFactory {

    public abstract createInitialized(): Promise<Match>;

    public abstract createEmpty(): Match;
    
}