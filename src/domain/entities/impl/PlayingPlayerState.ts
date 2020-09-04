import { BasePlayerState } from "./BasePlayerState";
import { Card, CardList } from "../../value_objects/Card";
import { Run } from "../Run";
import { RunID } from "../../value_objects/RunID";
import { TeamGamingArea } from "../TeamGamingArea";
import { ActionNotAllowedException } from "../../exceptions/ActionNotAllowedException";
import { CardNotOwnedException } from "../../exceptions/CardNotOwnedException";
import { CannotDiscardCardException } from "../../exceptions/CannotDiscardCardException";

export class PlayingPlayerState extends BasePlayerState {

    constructor(
        private hand: CardList,
        private gamingArea: TeamGamingArea,
        private lastCardTakenFromDiscardPile?: Card
    ) {
        super();

        if (lastCardTakenFromDiscardPile !== undefined && this.countOf(lastCardTakenFromDiscardPile) > 1) {
            this.lastCardTakenFromDiscardPile = undefined;
        }
    }

    private ownsCards(cards: CardList): boolean {
        const playerHand = [...this.hand];

        return cards.every(card => {
            const cardIndex = playerHand.indexOf(card);

            if (cardIndex === -1) {
                return false;
            }

            playerHand.splice(cardIndex, 1);
            return true;
        });
    }

    private countOf(card: Card): number {
        return this.hand
            .filter(handCard => handCard.isEqual(card))
            .length;
    }

    private isLastCardTakenFromDiscardPile(card: Card): boolean {
        return this.lastCardTakenFromDiscardPile !== undefined &&
            this.lastCardTakenFromDiscardPile.isEqual(card);
    }

    private ensureOwnsCards(cards: CardList) {
        if (!this.ownsCards(cards)) {
            throw new CardNotOwnedException();
        }
    }

    public takeOneCardFromStock(): Card {
        throw new ActionNotAllowedException();
    }
    
    public pickUpAllCardsFromDiscardPile(): CardList {
        throw new ActionNotAllowedException();
    }

    public createRun(cards: CardList): Run {
        this.ensureOwnsCards(cards);
        return this.gamingArea.createRun(cards);
    }

    public meldCardsToRun(cards: CardList, runId: RunID): Run {
        this.ensureOwnsCards(cards);
        throw new Error('Method not implemented');
    }

    public discard(card: Card): void {
        this.ensureOwnsCards([card]);

        if (this.isLastCardTakenFromDiscardPile(card)) {
            throw new CannotDiscardCardException();
        }
    }

}