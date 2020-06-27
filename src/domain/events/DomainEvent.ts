import { Event, EventPayload } from "../../tech/events/Event";
import { Card, CardList } from "../value_objects/Card";

export abstract class DomainEvent implements Event {
    private payload: EventPayload = Object.freeze({});

    protected serializeCard(card: Card): any {
        return {
            suit: card.getSuit(),
            value: card.getValue(),
        };
    }

    protected serializeCardList(cards: CardList): any[] {
        return cards.map((card) => this.serializeCard(card));
    }

    protected setPayload(payload: EventPayload): void {
        this.payload = Object.freeze(payload);
    }

    public getPayload(): EventPayload {
        return this.payload;
    }
    
    public abstract getName(): string;

}