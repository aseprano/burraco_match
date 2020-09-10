import { DomainEvent } from "./DomainEvent";
import { CardList } from "../value_objects/CardList";

const EventName = 'com.herrdoktor.buraco.events.CardsDealtToPlayer';

export class CardsDealtToPlayer extends DomainEvent {
    public static readonly EventName = EventName;

    constructor(matchId: number, cards: CardList, playerId: string) {
        super();
        
        this.setPayload({
            match_id: matchId,
            cards: this.serializeCardList(cards),
            player_id: playerId,
        });
    }

    public getName(): string {
        return EventName;
    }

}