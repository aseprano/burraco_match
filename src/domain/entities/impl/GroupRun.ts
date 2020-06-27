import { AbstractRun } from './AbstractRun';
import { Card, CardList } from "../../value_objects/Card";
import { WildcardException } from "../../exceptions/WildcardException";
import { RunException } from "../../exceptions/RunException";

export class GroupRun extends AbstractRun
{
    private value: number = 0;

    public static withCardsAndWildcardPosition(cards: CardList, wildcardPosition: number): GroupRun {
        return new GroupRun(cards, wildcardPosition);
    }

    public static withCard(card: Card): GroupRun
    {
        if (card.isJoker()) {
            throw new RunException('Cannot start a gamerun with a joker');
        }

        if (card.getValue() === 2) {
            throw new RunException('Cannot start a group with a deuce');
        }

        return new GroupRun([card], -1);
    }

    private constructor(cards: CardList, wildcardPosition: number) {
        super(cards, wildcardPosition);

        switch (wildcardPosition) {
            case 0:
                this.value = cards[1].getValue();
                break;

            default:
                this.value = cards[0].getValue();
                break;
        }
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

}
