import { CardList } from "../../value_objects/CardList";
import { StandardRunScoringPolicy } from "./StandardRunScoringPolicy";

export class HalfDirtyRunScoringPolicy extends StandardRunScoringPolicy {

    public getScore(cards: CardList, wildcardPosition: number): number {
        if (cards.length >= 7 && wildcardPosition > 6) {
            return 150;
        } else {
            return super.getScore(cards, wildcardPosition);
        }
    }

}