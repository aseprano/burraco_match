import { Player } from "../Player";
import { Event } from "../../../tech/events/Event";
import { Card, CardList } from "../../value_objects/Card";
import { Run } from "../Run";
import { RunID } from "../../value_objects/RunID";
import { Stock } from "../Stock";
import { AbstractEntity } from "./AbstractEntity";
import { CardsDealtToPlayer } from "../../events/CardsDealtToPlayer";
import { CardSerializer } from "../../domain-services/CardSerializer";
import { PlayerState } from "../PlayerState";
import { IdlePlayerState } from "./IdlePlayerState";
import { GameTurnToPlayer } from "../../events/GameTurnToPlayer";
import { ReadyPlayerState } from "./ReadyPlayerState";
import { PlayerTookOneCardFromStock } from "../../events/PlayerTookOneCardFromStock";
import { PlayingPlayerState } from "./PlayingPlayerState";
import { TeamGamingArea } from "../TeamGamingArea";
import { PlayerPickedUpDiscardPile } from "../../events/PlayerPickedUpDiscardPile";
import { RunCreated } from "../../events/RunCreated";
import { CardsMeldedToRun } from "../../events/CardsMeldedToRun";
import { PlayerThrewCardToDiscardPile } from "../../events/PlayerThrewCardToDiscardPile";

export class ConcretePlayer extends AbstractEntity implements Player {
    private hand: CardList = [];
    private state: PlayerState;

    public constructor(
        private playerId: string,
        private cardSerializer: CardSerializer,
        private stock: Stock,
        private discardPile: CardList,
        private gamingArea: TeamGamingArea
    ) {
        super();
        this.state = new IdlePlayerState();
    }

    private isEventOfMine(event: Event): boolean {
        return event.getPayload().player_id === this.playerId;
    }

    private unserializeCards(eventCards: any[]): CardList {
        return this.cardSerializer.unserializeCards(eventCards);
    }
    
    private appendCardsFromEvent(eventCards: any[]) {
        const cards: CardList = this.unserializeCards(eventCards);
        this.hand.push(...cards);
    }

    private removeEventCardsFromHand(eventCards: any[]) {
        this.unserializeCards(eventCards)
            .forEach((card) => {
                const cardIndex = this.hand.findIndex((handCard) => handCard.isEqual(card));

                if (cardIndex >= 0) {
                    this.hand.splice(cardIndex, 1);
                }
            });
    }

    private handleCardsDealtToPlayerEvent(event: Event) {
        this.appendCardsFromEvent(event.getPayload().cards);
    }

    private handlePlayerTookOneCardFromStockEvent(event: Event) {
        const card = this.cardSerializer.unserializeCard(event.getPayload().card);
        this.hand.push(card);
        this.switchToPlayingState();
    }

    private handlePlayerPickedUpDiscardPileEvent(event: Event) {
        const cards = this.cardSerializer.unserializeCards(event.getPayload().cards);
        const theOneCardFromDiscardPile = cards.length > 0 ? cards[0] : undefined;

        this.hand.push(...cards);
        this.switchToPlayingState(theOneCardFromDiscardPile);
    }

    private handleRunCreatedEvent(event: Event) {
        this.removeEventCardsFromHand(event.getPayload().run.cards);
    }

    private handleCardsMeldedToRunEvent(event: Event) {
        this.removeEventCardsFromHand(event.getPayload().cards);
    }

    private handleCardThrownToDiscardPileEvent(event: Event) {
        this.removeEventCardsFromHand([event.getPayload().card]);
        this.switchToIdleState();
    }

    protected doApplyEvent(event: Event): void {
        if (!this.isEventOfMine(event)) {
            //console.debug(`Event ${event.getName()} is not of mine (I am ${this.playerId}, whereas event player is ${event.getPayload().player_id})`);
            return;
        }
        
        switch (event.getName()) {
            case CardsDealtToPlayer.EventName:
                this.handleCardsDealtToPlayerEvent(event);
                break;

            case GameTurnToPlayer.EventName:
                this.switchToReadyState();
                break;

            case PlayerTookOneCardFromStock.EventName:
                this.handlePlayerTookOneCardFromStockEvent(event);
                break;

            case PlayerPickedUpDiscardPile.EventName:
                this.handlePlayerPickedUpDiscardPileEvent(event);
                break;

            case RunCreated.EventName:
                this.handleRunCreatedEvent(event);
                break;

            case CardsMeldedToRun.EventName:
                this.handleCardsMeldedToRunEvent(event);
                break;

            case PlayerThrewCardToDiscardPile.EventName:
                this.handleCardThrownToDiscardPileEvent(event);
                break;
        }
    }

    public getId() {
        return this.playerId;
    }

    public takeOneCardFromStock(): Card {
        return this.state.takeOneCardFromStock();
    }

    public pickUpAllCardsFromDiscardPile(): CardList {
        return this.state.pickUpAllCardsFromDiscardPile();
    }

    public createRun(cards: CardList): Run {
        return this.state.createRun(cards);
    }

    public meldCardsToRun(cards: CardList, runId: RunID): Run {
        return this.state.meldCardsToRun(cards, runId);
    }

    public throwCardToDiscardPile(card: Card): void {
        return this.state.throwCardToDiscardPile(card);
    }

    public getHand(): CardList {
        return this.hand.slice(0);
    }

    public setHand(hand: CardList): void {
        this.hand = hand;
    }

    public setState(newState: PlayerState) {
        this.state = newState;
    }

    public getState(): PlayerState {
        return this.state;
    }

    public switchToIdleState() {
        this.setState(new IdlePlayerState());
    }

    public switchToReadyState() {
        this.setState(new ReadyPlayerState(this.stock, this.discardPile));
    }

    public switchToPlayingState(cardTakenFromDiscardPile?: Card) {
        this.setState(new PlayingPlayerState(this.hand, this.gamingArea, cardTakenFromDiscardPile));
    }

}