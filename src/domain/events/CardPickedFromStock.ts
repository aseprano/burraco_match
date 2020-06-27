import { DomainEvent } from "./DomainEvent";
import { Card } from "../value_objects/Card";

export class CardPickedFromStock extends DomainEvent {
    public static EventName = 'com.herrdoktor.buraco.events.cardPickedFromStock';

    constructor(stockId: number, card: Card) {
        super();
        
        this.setPayload({
            stockId,
            card: this.serializeCard(card),
        });
    }

    public getName(): string {
        return CardPickedFromStock.EventName;
    }
}