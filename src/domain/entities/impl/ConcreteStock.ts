import { Stock } from "../Stock";
import { Card, CardList, Suit } from "../../value_objects/Card";
import { InsufficientCardsInStockException } from "../../exceptions/InsufficientCardsInStockException";
import { Event } from "../../../tech/events/Event";
import { MatchStarted } from "../../events/MatchStarted";
import { CardSerializer } from "../../domain-services/CardSerializer";
import { CardsDealtToPlayer } from "../../events/CardsDealtToPlayer";
import { Provider } from "../../../lib/Provider";
import { Consumer } from "../../../lib/Conumer";
import { CardsShuffler } from "../../domain-services/CardsShuffler";
import { PotCreated } from "../../events/PotCreated";
import { FirstCardThrown } from "../../events/FirstCardThrown";
import { AbstractEntity } from "./AbstractEntity";

export class ConcreteStock extends AbstractEntity implements Stock {
    private cards: CardList = [];

    constructor(
        private serializer: CardSerializer,
        private shuffler: Consumer<CardList> = CardsShuffler.randomShuffling,
        private deckProvider?: Provider<CardList>,
    ) {
        super();
    }

    private getNewDeckOfCards(): CardList {
        if (this.deckProvider) {
            return this.deckProvider().slice(0);
        }

        const newDeck: CardList = [];

        [...Array(2)].forEach(() => {
            [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades].forEach((suit) => {
                [...Array(13).keys()].forEach((value) => {
                    newDeck.push(new Card(suit, value+1));
                })
            });

            newDeck.push(Card.Joker(), Card.Joker());
        });

        return newDeck;
    }

    private hasLessCardsThan(n: number): boolean {
        return this.cards.length < n;
    }

    private setCards(newCards: CardList) {
        this.cards = newCards.slice(0);
    }

    private removeFirstOccurrenceOf(cardToRemove: Card) {
        const firstOccurrence = this.cards.findIndex((card) => card.isEqual(cardToRemove));

        if (firstOccurrence !== -1) {
            this.cards.splice(firstOccurrence, 1);
        }
    }

    private removeCardsFromEvent(cards: any[]) {
        this.serializer.unserializeCards(cards)
            .forEach((card) => this.removeFirstOccurrenceOf(card))
    }

    /**
     * Returns n cards from the top of the stock.
     * The cards are not removed.
     * 
     * @param n 
     */
    private get(n: number): CardList {
        return this.cards.slice(0, n);
    }

    private handleMatchStartedEvent(event: Event) {
        this.setCards(this.serializer.unserializeCards(event.getPayload().stock));
    }

    private handleCardsDealtToPlayerEvent(event: Event) {
        this.removeCardsFromEvent(event.getPayload().cards);
    }

    private handlePotCreatedEvent(event: Event) {
        this.removeCardsFromEvent(event.getPayload().cards);
    }

    private handleFirstCardThrownEvent(event: Event) {
        this.removeCardsFromEvent([event.getPayload().card]);
    }

    public getId(): number {
        return 1;
    }

    protected doApplyEvent(event: Event): void {
        switch (event.getName()) {
            case MatchStarted.EventName:
                this.handleMatchStartedEvent(event);
                break;

            case CardsDealtToPlayer.EventName:
                this.handleCardsDealtToPlayerEvent(event);
                break;

            case PotCreated.EventName:
                this.handlePotCreatedEvent(event);
                break;

            case FirstCardThrown.EventName:
                this.handleFirstCardThrownEvent(event);
                break;
        }
    }

    public shuffle(): void {
        const deck = this.getNewDeckOfCards();
        this.shuffler(deck);
        this.setCards(deck);
    }

    public take(n: number): CardList {
        if (this.hasLessCardsThan(n)) {
            throw new InsufficientCardsInStockException();
        }
        
        return this.get(n);
    }
    
    public takeOne(): Card {
        return this.take(1)[0];
    }

    public getCards(): CardList {
        return this.cards.slice(0);
    }
    
}