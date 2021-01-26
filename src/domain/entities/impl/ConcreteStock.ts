import { Stock } from "../Stock";
import { Card, Suit } from "../../value_objects/Card";
import { CardList } from "../../value_objects/CardList";
import { InsufficientCardsInStockException } from "../../exceptions/InsufficientCardsInStockException";
import { MatchStarted } from "../../events/MatchStarted";
import { CardSerializer } from "../../domain-services/CardSerializer";
import { CardsDealtToPlayer } from "../../events/CardsDealtToPlayer";
import { CardsShuffler } from "../../domain-services/CardsShuffler";
import { PotCreated } from "../../events/PotCreated";
import { FirstCardThrown } from "../../events/FirstCardThrown";
import { PlayerTookOneCardFromStock } from "../../events/PlayerTookOneCardFromStock";
import { Function, Provider } from '@darkbyte/herr/lib/types';
import { AbstractEntity, Event } from '@darkbyte/herr';

export class ConcreteStock extends AbstractEntity implements Stock {
    private cards = new CardList();

    constructor(
        private serializer: CardSerializer,
        private shuffler: Function<CardList,CardList> = CardsShuffler.randomShuffling,
        private deckProvider?: Provider<CardList>,
    ) {
        super();
    }

    private getNewDeckOfCards(): CardList {
        if (this.deckProvider) {
            return this.deckProvider();
        }

        const newDeck: Array<Card> = [];

        [...Array(2)].forEach(() => {
            [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades].forEach((suit) => {
                [...Array(13).keys()].forEach((value) => {
                    newDeck.push(new Card(suit, value+1));
                })
            });

            newDeck.push(Card.Joker(), Card.Joker());
        });

        return new CardList(newDeck);
    }

    private hasLessCardsThan(n: number): boolean {
        return this.cards.length < n;
    }

    private setCards(newCards: CardList) {
        this.cards = newCards;
    }

    private removeCardsFromEvent(cards: any[]) {
        this.cards = this.cards.remove(this.serializer.unserializeCards(cards));
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

    private handlePlayerTookCardFromStockEvent(event: Event) {
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

            case PlayerTookOneCardFromStock.EventName:
                this.handlePlayerTookCardFromStockEvent(event);
                break;
        }
    }

    public shuffle(): void {
        this.setCards(this.shuffler(this.getNewDeckOfCards()));
    }

    public take(n: number): CardList {
        if (this.hasLessCardsThan(n)) {
            throw new InsufficientCardsInStockException();
        }
        
        return this.get(n);
    }
    
    public takeOne(): Card {
        return this.take(1).cards[0];
    }

    public getCards(): CardList {
        return this.cards;
    }

    public asArray(): ReadonlyArray<Card> {
        return this.cards.asArray();
    }
    
}