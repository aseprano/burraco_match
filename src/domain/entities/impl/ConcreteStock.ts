import { Stock } from "../Stock";
import { Card, CardList, Suit } from "../../value_objects/Card";
import { InsufficientCardsInStockException } from "../../exceptions/InsufficientCardsInStockException";
import { Event } from "../../../tech/events/Event";
import { MatchStarted } from "../../events/MatchStarted";
import { CardSerializer } from "../../domain-services/CardSerializer";
import { timingSafeEqual } from "crypto";

export class ConcreteStock implements Stock {
    private cards: CardList = [];

    constructor(private serializer: CardSerializer) {}

    private rebuild(): void {
        const newCards: CardList = [];

        [...Array(2)].forEach(() => {
            [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades].forEach((suit) => {
                [...Array(13).keys()].forEach((value) => {
                    newCards.push(new Card(suit, value+1));
                })
            });

            newCards.push(Card.Joker(), Card.Joker());
        });

        this.cards = newCards;
    }

    private hasLessCardsThan(n: number): boolean {
        return this.cards.length < n;
    }

    private shift(n: number): CardList {
        return this.cards.splice(0, n);
    }

    private handleMatchStarted(event: Event) {
        this.cards = this.serializer.unserializeCards(event.getPayload().stock);
    }

    public getId(): number {
        return 1;
    }

    public applyEvent(event: Event): void {
        switch (event.getName()) {
            case MatchStarted.EventName:
                this.handleMatchStarted(event);
                break;
        }
    }

    public shuffle(): void {
        this.rebuild();

        const newCards: CardList = [];

        while (this.cards.length) {
            newCards.push(...this.cards.splice(Math.floor(Math.random()*this.cards.length), 1));
        }

        this.cards = newCards;
    }

    public pick(n: number): CardList {
        if (this.hasLessCardsThan(n)) {
            throw new InsufficientCardsInStockException();
        }
        
        return this.shift(n);
    }
    
    public pickOne(): Card {
        return this.pick(1)[0];
    }

    public getCards(): CardList {
        return this.cards;
    }
    
    public isEmpty(): boolean {
        return this.cards.length === 0;
    }

}