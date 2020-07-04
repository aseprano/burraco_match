import { DomainEvent } from "./DomainEvent";
import { CardList } from "../value_objects/Card";

export class MatchInitialized extends DomainEvent {
    public static EventName = 'com.herrdoktor.buraco.events.MatchInitialized';

    constructor(matchId: number, cards: CardList) {
        super();
        
        this.setPayload({
            id: matchId,
            cards: this.serializeCardList(cards)
        });
    }

    public getName(): string {
        return MatchInitialized.EventName;
    }
    
}