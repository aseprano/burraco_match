import { RunFactory } from "../RunFactory";
import { Card } from "../../value_objects/Card";
import { CardList } from "../../value_objects/CardList";
import { RunID } from "../../value_objects/RunID";
import { Run } from "../../entities/Run";
import { GroupRun } from "../../entities/impl/GroupRun";
import { SequenceRun } from "../../entities/impl/SequenceRun";
import { RunException } from "../../exceptions/RunException";
import { AbstractRun } from "../../entities/impl/AbstractRun";
import { CannotBuildRunException } from "../../exceptions/CannotBuildRunException";
import { Injectable } from '@darkbyte/herr';

@Injectable()
export class ConcreteRunFactory extends RunFactory {

    constructor() {
        super();
    }
    
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
        const firstNonWildcardIndex = cards.asArray().findIndex(this.isNonWildcard);

        if (firstNonWildcardIndex === -1) {
            throw new RunException('Invalid cards for a run');
        }

        const firstNonWildcard = cards.at(firstNonWildcardIndex);
        cards = cards.remove(firstNonWildcard);

        try {
            return this.createGroupRun(firstNonWildcard, cards);
        } catch (e) {
            return this.createSequenceRun(firstNonWildcard, cards);
        }
    }

    public build(cards: ReadonlyArray<Card>|CardList, id: RunID): Run {
        if (!(cards instanceof CardList)) {
            return this.build(new CardList(cards), id);
        }
        
        try {
            const run = this.buildRun(cards);
            run.setId(id);
            return run;
        } catch (e) {
            throw new CannotBuildRunException();
        }
    }

}
