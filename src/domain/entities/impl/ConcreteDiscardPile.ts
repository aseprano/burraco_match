import { AbstractEntity } from "./AbstractEntity";
import { DiscardPile } from "../DiscardPile";
import { Card, CardList } from "../../value_objects/Card";
import { Event } from "../../../tech/events/Event";
import { SnapshotState } from "../../../tech/Snapshot";
import { DiscardPileInitialized } from "../../events/DiscardPileInitialized";
import { CardsPickedFromDiscardPile } from "../../events/CardsPickedFromDiscardPile";
import { CardThrownToDiscardPile } from "../../events/CardThrownToDiscardPile";
import { CardSerializer } from "../../domain-services/CardSerializer";

export class ConcreteDiscardPile extends AbstractEntity implements DiscardPile {
    private id = 0;
    private cards: CardList = [];

    constructor(private cardSerializer: CardSerializer) {
        super();
    }

    private handleDiscardPileInitializedEvent(event: Event) {
        this.id = event.getPayload()['id'];
    }

    private handleCardsPickedFromDiscardPileEvent(event: Event) {
        this.cards = [];
    }

    private handleCardThrownToDiscardPileEvent(event: Event) {
        const card: any = event.getPayload()['card'];

        this.cards.push(new Card(card['suit'], card['value']));
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
            case DiscardPileInitialized.EventName:
                this.handleDiscardPileInitializedEvent(event);
                break;

            case CardsPickedFromDiscardPile.EventName:
                this.handleCardsPickedFromDiscardPileEvent(event);
                break;

            case CardThrownToDiscardPile.EventName:
                this.handleCardThrownToDiscardPileEvent(event);
                break;
        }
    }
    
    public initalize(id: number, matchId: number) {
        this.appendUncommittedEvent(new DiscardPileInitialized(id, matchId));
    }

    public takeAll(): CardList {
        const cards = this.cards;
        this.appendUncommittedEvent(new CardsPickedFromDiscardPile(this.id, this.cards));
        return cards;
    }

    public throwCard(newCard: Card): void {
        this.appendUncommittedEvent(new CardThrownToDiscardPile(this.id, newCard));
    }

    public getCards(): CardList {
        return this.cards;
    }

}
