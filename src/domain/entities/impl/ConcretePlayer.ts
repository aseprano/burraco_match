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
    
    private appendCardsFromEvent(eventCards: any[]) {
        const cards: CardList = this.cardSerializer.unserializeCards(eventCards);
        this.hand.push(...cards);
    }

    private handleCardsDealtToPlayerEvent(event: Event) {
        if (event.getPayload().player_id === this.playerId) {
            this.appendCardsFromEvent(event.getPayload().cards);
        }
    }

    private handlePlayerTookOneCardFromStockEvent(event: Event) {
        const card = this.cardSerializer.unserializeCard(event.getPayload().card);
        this.hand.push(card);
        this.switchToReadyState();
    }

    protected doApplyEvent(event: Event): void {
        if (!this.isEventOfMine(event)) {
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

    public discard(card: Card): void {
        return this.state.discard(card);
    }

    public getHand(): CardList {
        return this.hand.slice(0);
    }

    public setState(newState: PlayerState) {
        this.state = newState;
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