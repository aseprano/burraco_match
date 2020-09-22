import { RunScoringPolicy } from "../RunScoringPolicy";
import { CardList } from "../../value_objects/CardList";

export class StandardRunScoringPolicy implements RunScoringPolicy {

    constructor() {}

    getScore(run: CardList, wildcardPosition: number): number {
        if (run.length < 7) {
            return 0;
        } else if (wildcardPosition === -1) {
            return 200;
        } else {
            return 100;
        }
    }

}