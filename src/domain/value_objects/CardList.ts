import { Card } from "./Card";

export class CardList {
    public readonly length: number;
    public readonly cards: ReadonlyArray<Card>;

    public static empty(): CardList {
        return new CardList();
    }

    constructor(cards: Card|ReadonlyArray<Card> = []) {
        if (cards instanceof Card) {
            this.cards = [cards];
        } else {
            this.cards = cards;
        }

        this.length = this.cards.length;
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

    public removeRange(from: number, length: number): CardList {
        return new CardList([...this.cards].splice(from, length));
    }

    public add(newCards: Card|CardList|ReadonlyArray<Card>): CardList {
        if (newCards instanceof Card) {
            return this.add([newCards]);
        } else if (newCards instanceof CardList) {
            return this.add(newCards.cards);
        } else {
            return new CardList([...this.cards, ...newCards]);
        }
    }

    public clear(): CardList {
        return new CardList();
    }

    public isEqual(otherList: CardList): boolean {
        return this === otherList || (this.length === otherList.length && this.contains(otherList.cards));
    }

    public slice(start: number, end: number): CardList {
        return new CardList(this.cards.slice(start, end));
    }

}
