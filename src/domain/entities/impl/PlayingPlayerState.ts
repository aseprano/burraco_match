import { BasePlayerState } from "./BasePlayerState";
import { Card } from "../../value_objects/Card";
import { CardList } from "../../value_objects/CardList";
import { Run } from "../Run";
import { RunID } from "../../value_objects/RunID";
import { TeamGamingArea } from "../TeamGamingArea";
import { ActionNotAllowedException } from "../../exceptions/ActionNotAllowedException";
import { CardNotOwnedException } from "../../exceptions/CardNotOwnedException";
import { CannotThrowCardException } from "../../exceptions/CannotThrowCardException";
import { ActionPreventedException } from "../../exceptions/ActionPreventedException";

export class PlayingPlayerState extends BasePlayerState {

    constructor(
        public readonly hand: CardList,
        private gamingArea: TeamGamingArea,
        public readonly potTaken: boolean,
        public readonly lastCardTakenFromDiscardPile?: Card,
    ) {
        super();
    }

    private getHandWithoutCards(cardsToRemove: CardList): CardList {
        return this.hand.remove(cardsToRemove);
    }

    private ownsCards(cards: Card|CardList|ReadonlyArray<Card>): boolean {
        if (cards instanceof Card) {
            return this.ownsCards([cards]);
        } else if (cards instanceof CardList) {
            return this.ownsCards(cards.asArray());
        }

        const playerHand = [...this.hand.cards];

        return cards.every(cardToRemove => {
            const handCardIndex = playerHand.findIndex(handCard => handCard.isEqual(cardToRemove));

            if (handCardIndex === -1) {
                return false;
            }

            playerHand.splice(handCardIndex, 1);
            return true;
        });
    }

    private isLastCardTakenFromDiscardPile(card: Card): boolean {
        return this.lastCardTakenFromDiscardPile !== undefined &&
            this.lastCardTakenFromDiscardPile.isEqual(card);
    }

    private ensureOwnsCards(cards: Card|CardList|ReadonlyArray<Card>) {
        if (!this.ownsCards(cards)) {
            throw new CardNotOwnedException();
        }
    }

    private hasAtLeastOneBuraco(): boolean {
        return this.gamingArea
            .getRuns()
            .some((run: Run) => run.getCards().length >= 7);
    }

    private ensureCanRemoveCardsFromHand(cards: CardList)
    {
        this.ensureOwnsCards(cards);

        /**
         * Cases when cards cannot be used to create/change a run:
         * 
         * 1 - Player would have no more cards in the hand (except in case the pot has not been taken, yet)
         * 2 - Last card in the hand would be the last card taken from the discard pile
         * 3 - Last card in the hand would be a joker/deuce
         * 4 - Player would end up with just one card in the hand, eventually ending the match without at least one buraco (hence: when the pot has been taken)
         */

        const newHand = this.getHandWithoutCards(cards);

        if (
            (this.potTaken && newHand.length === 0)
            ||
            newHand.length === 1 && (
                this.isLastCardTakenFromDiscardPile(newHand.cards[0])
                ||
                newHand.cards[0].isJoker()
                ||
                newHand.cards[0].isDeuce()
                ||
                !this.hasAtLeastOneBuraco()
            )
        ) {
            throw new ActionPreventedException();
        }
    }

    public takeOneCardFromStock(): Card {
        throw new ActionNotAllowedException();
    }
    
    public pickUpAllCardsFromDiscardPile(): CardList {
        throw new ActionNotAllowedException();
    }

    public createRun(cards: CardList): Run {
        this.ensureCanRemoveCardsFromHand(cards);
        return this.gamingArea.createRun(cards);
    }

    public meldCardsToRun(cards: CardList, runId: RunID): Run {
        this.ensureCanRemoveCardsFromHand(cards);
        return this.gamingArea.addCardsToRun(cards, runId);
    }

    public throwCardToDiscardPile(card: Card): void {
        this.ensureOwnsCards([card]);

        if (this.isLastCardTakenFromDiscardPile(card)) {
            throw new CannotThrowCardException();
        }
    }

}