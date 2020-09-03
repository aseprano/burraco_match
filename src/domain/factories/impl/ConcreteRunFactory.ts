import { RunFactory } from "../RunFactory";
import { CardList, Card } from "../../value_objects/Card";
import { RunID } from "../../value_objects/RunID";
import { Run } from "../../entities/Run";
import { GroupRun } from "../../entities/impl/GroupRun";
import { SequenceRun } from "../../entities/impl/SequenceRun";
import { RunException } from "../../exceptions/RunException";
import { AbstractRun } from "../../entities/impl/AbstractRun";
import { CannotBuildRunException } from "../../exceptions/CannotBuildRunException";

export class ConcreteRunFactory implements RunFactory {

    private isNonWildcard(card: Card): boolean {
        return card.getValue() !== 2 && !card.isJoker();
    }

    private createGroupRun(firstCard: Card, otherCards: CardList): GroupRun {
        const run = GroupRun.startWithCard(firstCard);
        run.add(otherCards);
        return run;
    }

    private createSequenceRun(firstCard: Card, otherCards: CardList): SequenceRun {
        const run = SequenceRun.startWithCard(firstCard);
        run.add(otherCards);
        return run;
    }

    private buildRun(cards: CardList): AbstractRun {
        const firstNonWildcard = cards.findIndex(this.isNonWildcard);

        if (firstNonWildcard === -1) {
            throw new RunException('Invalid cards for a run');
        }

        const firstCard = cards.splice(firstNonWildcard, 1)[0];

        try {
            return this.createGroupRun(firstCard, cards);
        } catch (e) {
            return this.createSequenceRun(firstCard, cards);
        }
    }

    public build(cards: CardList, id: RunID): Run {
        try {
            const run = this.buildRun(cards);
            run.setId(id);
            return run;
        } catch (e) {
            throw new CannotBuildRunException();
        }
    }

}
