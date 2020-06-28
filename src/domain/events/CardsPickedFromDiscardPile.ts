import { DomainEvent } from "./DomainEvent";
import { CardList } from "../value_objects/Card";

const EventName = "com.herrdoktor.buraco.events.cardsPickedFromDiscardPile";

export class CardsPickedFromDiscardPile extends DomainEvent {
    public static EventName = EventName;

    constructor(
        discardPileId: number,
        cards: CardList
    ) {
        super();

        this.setPayload({
            discardPileId,
            cards: this.serializeCardList(cards),
        });
    }

    public getName(): string {
        return EventName;
    }
}
