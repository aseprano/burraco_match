import { Player } from "../Player";
import { Event } from "../../../tech/events/Event";
import { Card } from "../../value_objects/Card";
import { CardList } from "../../value_objects/CardList";
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
    private hand = new CardList();
    private state: PlayerState;
    private lastCardTaken?: Card;
    private potTaken = false;

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
        this.hand = this.hand.append(this.unserializeCards(eventCards));
    }

    private removeEventCardsFromHand(eventCards: any[]) {
        this.hand = this.hand.remove(this.unserializeCards(eventCards));
    }

    private handleCardsDealtToPlayerEvent(event: Event) {
        this.appendCardsFromEvent(event.getPayload().cards);
    }

    private handlePlayerTookOneCardFromStockEvent(event: Event) {
        const card = this.cardSerializer.unserializeCard(event.getPayload().card);
        this.hand = this.hand.append(card);
        this.lastCardTaken = undefined;
        this.switchToPlayingState();
    }

    private handlePlayerPickedUpDiscardPileEvent(event: Event) {
        const cards = this.cardSerializer.unserializeCards(event.getPayload().cards);
        this.lastCardTaken = cards.length === 1 && !this.hand.contains(cards.at(0)) ? cards.at(0) : undefined;

        this.hand = this.hand.append(cards);
        this.switchToPlayingState();
    }

    private handleRunCreatedEvent(event: Event) {
        this.removeEventCardsFromHand(event.getPayload().run.cards);
        this.switchToPlayingState();
    }

    private handleCardsMeldedToRunEvent(event: Event) {
        this.removeEventCardsFromHand(event.getPayload().cards);
        this.switchToPlayingState();
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
        return this.hand;
    }

    public setHand(newHand: CardList): void {
        this.hand = newHand;
    }

    public setState(newState: PlayerState) {
        this.state = newState;
    }

    public getState(): PlayerState {
        return this.state;
    }

    public setLastCardTaken(card?: Card) {
        this.lastCardTaken = card;
    }

    public switchToIdleState() {
        this.setState(new IdlePlayerState());
    }

    public switchToReadyState() {
        this.setState(new ReadyPlayerState(this.stock, this.discardPile));
    }

    public switchToPlayingState() {
        this.setState(new PlayingPlayerState(this.hand, this.gamingArea, this.potTaken, this.lastCardTaken));
    }

}