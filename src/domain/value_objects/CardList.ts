import { Card } from "./Card";
import e from "express";

export class CardList {
    public readonly length: number;

    constructor(public readonly cards: ReadonlyArray<Card>) {
        this.length = cards.length;
    }

    /**
     * Returns true if the current object contains each and all of the provided cards
     * 
     * @param cards 
     * @returns CardList
     */
    public contains(cards: Card|CardList|ReadonlyArray<Card>): boolean {
        if (cards instanceof Card) {
            return this.contains([cards]);
        } else if (cards instanceof CardList) {
            return this.contains(cards.cards);
        } else if (!cards.length) {
            return true;
        }

        const localCards = [...this.cards];

        return cards.every((card) => {
            const cardIndex = localCards.findIndex((handCard) => handCard.isEqual(card));

            if (cardIndex >= 0) {
                localCards.splice(cardIndex, 1);
                return true;
            }

            return false;
        });
    }

    /**
     * Returns a new instance of CardList after removing the list of provided cards
     * 
     * @param cards 
     * @returns CardList
     */
    public remove(cards: Card|CardList|ReadonlyArray<Card>): CardList {
        if (cards instanceof Card) {
            return this.remove([cards]);
        } else if (cards instanceof CardList) {
            return this.remove(cards.cards);
        }

        const newCards = [...this.cards];

        cards.forEach((card) => {
            const cardIndex = newCards.findIndex(localCard => localCard.isEqual(card));

            if (cardIndex >= 0) {
                newCards.splice(cardIndex, 1);
            }
        });

        return new CardList(newCards);
    }

    public isEqual(otherList: CardList): boolean {
        return this === otherList || (this.length === otherList.length && this.contains(otherList.cards));
    }

}
