import { AbstractRun } from './AbstractRun';
import { Card, Suit } from "../../value_objects/Card";
import { CardList } from "../../value_objects/CardList";
import { RunException } from "../../exceptions/RunException";
import { WildcardException } from "../../exceptions/WildcardException";
import { GameTurnToPlayer } from "../../events/GameTurnToPlayer";

export class SequenceRun extends AbstractRun
{
    private suit: Suit;

    public static startWithCard(card: Card): SequenceRun
    {
        if (card.isJoker()) {
            throw new RunException('Cannot start a gamerun with a joker');
        }

        if (card.isDeuce()) {
            throw new RunException('Cannot start a group with a deuce');
        }

        return new SequenceRun(new CardList(card));
    }

    public static restore(cards: CardList|ReadonlyArray<Card>, wildcardPosition: number) {
        if (cards instanceof CardList) {
            return new SequenceRun(cards, wildcardPosition);
        } else {
            return new SequenceRun(new CardList(cards), wildcardPosition);
        }
    }

    private constructor(cards: CardList, wildcardPosition = -1) {
        super(cards, wildcardPosition);
        this.suit = cards.at(wildcardPosition === 0 ? 1 : 0).getSuit();
    }

    public getWildcardValue(): number {
        if (this.wildcardIsTheBottommostCard()) {
            return this.getCardAt(1).getValue() - 1;
        } else if (this.wildcardIsTheTopmostCard()) {
            const cardPrecedingWildcard = this.getCardAt(this.size() - 2);
            return cardPrecedingWildcard.getValue() + 1;
        } else {
            return this.getCardAt(this.getWildcardPosition()-1).getValue() + 1;
        }
    }

    private tryLinkCardAtTop(newCard: Card): boolean {
        const topmostCard = this.getTopCard();
        
        if (
            (topmostCard.getValue() === 13 && newCard.getValue() === 1)
            ||
            (!this.wildcardIsTheTopmostCard() && newCard.getValue() === topmostCard.getValue() + 1)
            ||
            (this.wildcardIsTheTopmostCard() && this.getCardAt(this.getWildcardPosition() - 1).getValue() === newCard.getValue() - 2)
        ) {
            this.insertCardAtTop(newCard);
            return true;
        } else if (this.getBottomCard().isDeuce() && this.getWildcardPosition() <= 0 && (newCard.getValue() === this.getTopCard().getValue() + 2 || newCard.getValue() === 1 && topmostCard.getValue() === 12)) {
            const bottomDeuce = this.removeCardAtBottom();
            this.insertWildcardAtTop(bottomDeuce);
            this.insertCardAtTop(newCard);
            return true;
        } else if (this.wildcardIsTheBottommostCard() && (newCard.getValue() === this.getTopCard().getValue() + 2 || newCard.getValue() === 1 && topmostCard.getValue() === 12)) {
            const joker = this.removeCardAtBottom();
            this.insertWildcardAtTop(joker);
            this.insertCardAtTop(newCard);
            return true;
        }

        return false;
    }

    private tryLinkCardAtBottom(newCard: Card): boolean {
        if (
            (this.getWildcardPosition() === 0 && this.getCardAt(1).getValue() === newCard.getValue() + 2)
            ||
            (this.getBottomCard().getValue() === newCard.getValue() + 1)
            ||
            (this.getBottomCard().getValue() === 1 && newCard.getValue() === 13 && this.size() === 1)
        )
        {
            this.insertCardAtBottom(newCard);
            return true;
        }

        return false;
    }

    public tryReplaceWildcard(newCard: Card): boolean {
        if (newCard.getValue() === this.getWildcardValue()) {
            const wildcard = this.replaceWildcard(newCard);

            if (wildcard.isJoker()) {
                this.addJoker(wildcard);
            } else {
                this.addDeuce(wildcard);
            }

            return true;
        }

        return false;
    }

    private addDeuce(deuce: Card): boolean {
        // Check if the deuce can be used as natural deuce
        if (
            (deuce.getSuit() === this.suit)
            &&
            (
                (this.getBottomCard().getValue() === 3) // the bottommost card is a 3
                ||
                (this.wildcardIsTheBottommostCard() && this.getWildcardValue() === 3) // or a wildcard in place of a 3
            )
         ) {
            this.insertCardAtBottom(deuce);
        } else if (
            (deuce.getSuit() === this.suit)
            &&
            (this.size() === 1 && this.getBottomCard().getValue() === 1) // the only card in the sequence is an ace
        ) {
            this.insertCardAtTop(deuce);
        } else {
            // no, it is a wildcard
            if (this.hasWildcard()) {
                if (deuce.getSuit() === this.suit && this.tryReplaceWildcard(deuce)) {
                    return true;
                }

                throw new WildcardException('Game already contains a wildcard');
            }

            if (this.getBottomCard().getValue() !== 1) {
                this.insertWildcardAtBottom(deuce);
            } else {
                this.insertWildcardAtTop(deuce);
            }
        }

        return true;
    }

    protected addJoker(joker: Card): boolean {
        if (this.getBottomCard().getValue() !== 1) {
            this.insertWildcardAtBottom(joker);
        } else {
            this.insertWildcardAtTop(joker);
        }

        return true;
    }

    protected addCard(newCard: Card): boolean {
        if (newCard.isDeuce()) {
            return this.addDeuce(newCard);
        } else if (!newCard.isDeuce() && newCard.getSuit() !== this.suit) {
            throw new RunException('Bad suit');
        }

        return this.tryLinkCardAtTop(newCard) ||
            this.tryLinkCardAtBottom(newCard) ||
            (this.hasWildcard() && this.tryReplaceWildcard(newCard));
    }

    public getSuit(): Suit {
        return this.suit;
    }

    public isSequence(): boolean {
        return true;
    }
    
}
