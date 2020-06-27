import { DomainEvent } from "./DomainEvent";
import { CardList } from "../value_objects/Card";

export class StockInitialized extends DomainEvent {
    public static EventName = 'com.herrdoktor.buraco.events.stockInitialized';

    constructor(
        stockId: number,
        matchId: number,
        cards: CardList
    ) {
        super();
        
        this.setPayload({
            id: stockId,
            matchId,
            cards: this.serializeCardList(cards),
        });
    }

    public getName(): string {
        return StockInitialized.EventName;
    }

}