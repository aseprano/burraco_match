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

    public at(index: number): Card {
        return this.cards[index];
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
            return this.contains(cards.asArray());
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
            return this.remove(cards.asArray());
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
        const newCards = [...this.cards];
        newCards.splice(from, length);
        return new CardList(newCards);
    }

    public append(newCards: Card|CardList|ReadonlyArray<Card>): CardList {
        if (newCards instanceof Card) {
            return this.append([newCards]);
        } else if (newCards instanceof CardList) {
            return this.append(newCards.asArray());
        } else {
            return new CardList([...this.cards, ...newCards]);
        }
    }

    /**
     * Inserts one or more cards starting from a specified index
     * 
     * @param newCards The card or the cards to insert
     * @param position The index at which the card will be inserted
     */
    public insert(newCards: Card|CardList|ReadonlyArray<Card>, position: number): CardList {
        if (newCards instanceof Card) {
            return this.insert([newCards], position);
        } else if (newCards instanceof CardList) {
            return this.insert(newCards.asArray(), position);
        } else {
            const cards = [...this.cards];
            cards.splice(position, 0, ...newCards);
            return new CardList(cards);
        }
    }

    public clear(): CardList {
        return new CardList();
    }

    public isEqual(otherList: CardList): boolean {
        return this === otherList || (this.length === otherList.length && this.contains(otherList.cards));
    }

    public asArray(): ReadonlyArray<Card> {
        return this.cards;
    }

    public slice(start: number, end: number): CardList {
        return new CardList(this.cards.slice(start, end));
    }

}
