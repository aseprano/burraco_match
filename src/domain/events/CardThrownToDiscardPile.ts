import { DomainEvent } from "./DomainEvent";
import { Card } from "../value_objects/Card";

const EventName = "com.herrdoktor.buraco.events.cardThrownToDiscardPile";

export class CardThrownToDiscardPile extends DomainEvent {
    public static EventName = EventName;

    constructor(
        discardPileId: number,
        newCard: Card
    ) {
        super();

        this.setPayload({
            discardPileId,
            card: this.serializeCard(newCard),
        });
    }

    public getName(): string {
        return EventName;
    }
}
