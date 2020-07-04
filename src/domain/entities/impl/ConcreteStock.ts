import { Stock } from "../Stock";
import { Card, CardList } from "../../value_objects/Card";
import { InsufficientCardsInStockException } from "../../exceptions/InsufficientCardsInStockException";

export class ConcreteStock implements Stock {
    private cards: CardList = [];

    public initialize(cards: CardList): void {
        this.cards = cards.slice(0);
    }

    public pickOne(): Card {
        return this.pick(1)[0];
    }

    public pick(n: number): CardList {
        if (this.cards.length < n) {
            throw new InsufficientCardsInStockException();
        }

        return this.cards.splice(0, n);
    }

    public getCards(): CardList {
        return this.cards;
    }
    
    public isEmpty(): boolean {
        return this.cards.length === 0;
    }

    public shift(n: number) {
        this.cards.splice(0, n);
    }

}