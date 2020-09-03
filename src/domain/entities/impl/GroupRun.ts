import { AbstractRun } from './AbstractRun';
import { Card, CardList } from "../../value_objects/Card";
import { WildcardException } from "../../exceptions/WildcardException";
import { RunException } from "../../exceptions/RunException";

export class GroupRun extends AbstractRun
{
    private value: number = 0;

    public static startWithCard(card: Card): GroupRun
    {
        if (card.isJoker()) {
            throw new RunException('Cannot start a gamerun with a joker');
        }

        if (card.getValue() === 2) {
            throw new RunException('Cannot start a group with a deuce');
        }

        return new GroupRun([card]);
    }

    public static restore(cards: CardList, wildcardPosition: number): GroupRun {
        return new GroupRun(cards, wildcardPosition);
    }

    private constructor(cards: CardList, wildcardPosition = -1) {
        super(cards, wildcardPosition);
        this.value = cards[wildcardPosition === 0 ? 1 : 0].getValue();
    }

    protected addCard(card: Card): boolean {
        if (card.getValue() === 2) {
            if (this.hasWildcard()) {
                throw new WildcardException();
            }

            this.addJoker(card);
        } else if (card.getValue() !== this.value) {
            return false;
        } else {
            this.insertCardAtTop(card);
        }

        return true;
    }

    protected addJoker(joker: Card): boolean {
        this.insertWildcardAtBottom(joker);
        return true;
    }

    public getValue(): number {
        return this.value;
    }

    public isSequence(): boolean {
        return false;
    }

}
