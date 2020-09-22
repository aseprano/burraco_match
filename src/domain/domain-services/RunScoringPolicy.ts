import { CardList } from "../value_objects/CardList";

export interface RunScoringPolicy {

    getScore(run: CardList, wildcardPosition: number): number;
    
}