import { AbstractEntity } from "./AbstractEntity";
import { Stock } from "../Stock";
import { SnapshotState } from "../../../tech/Snapshot";
import { Event } from "../../../tech/events/Event";
import { Card, CardList } from "../../value_objects/Card";
import { StockInitialized } from "../../events/StockInitialized";
import { StockIsEmptyException } from "../../exceptions/StockIsEmptyException";
import { CardPickedFromStock } from "../../events/CardPickedFromStock";
import { CardSerializer } from "../../domain-services/CardSerializer";

export class ConcreteStock extends AbstractEntity implements Stock {
    private id: number = 0;
    private cards: CardList = [];

    constructor(private cardSerializer: CardSerializer) {
        super();
    }

    public initialize(stockId: number, matchId: number, cards: CardList) {
        this.appendUncommittedEvent(new StockInitialized(stockId, matchId, cards));
    }

    private handleStockInitializedEvent(event: Event) {
        this.id = event.getPayload()['id'];
        this.cards = event.getPayload()['cards'].map((card: any) => new Card(card['suit'], card['value']));
    }

    private handleCardPickedFromStockEvent(event: Event) {
        this.cards.shift();
    }

    public getId() {
        return this.id;
    }

    protected buildSnapshot(): SnapshotState {
        return {
            entityId: this.id,
            cards: this.cardSerializer.serializeCards(this.cards),
        };
    }

    protected applySnapshot(snapshot: SnapshotState): void {
        this.id = snapshot.entityId;
        this.cards = this.cardSerializer.unserializeCards(snapshot.cards);
    }

    protected applyEvent(event: Event): void {
        switch (event.getName()) {
            case StockInitialized.EventName:
                this.handleStockInitializedEvent(event);
                break;

            case CardPickedFromStock.EventName:
                this.handleCardPickedFromStockEvent(event);
                break;
        }
    }
    
    public pickOneCard(): Card {
        if (!this.cards.length) {
            throw new StockIsEmptyException();
        }

        const theCard = this.cards[0];

        this.appendUncommittedEvent(new CardPickedFromStock(this.getId(), theCard));

        return theCard;
    }

    public getCards(): CardList {
        return this.cards;
    }
    
    public isEmpty(): boolean {
        return this.cards.length === 0;
    }

}