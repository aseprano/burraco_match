import { DomainEvent } from "./DomainEvent";
import { CardList } from "../value_objects/Card";
import { PlayerID } from "../value_objects/PlayerID";

const EventName = 'com.herrdoktor.buraco.events.CardsDealtToPlayer';

export class CardsDealtToPlayer extends DomainEvent {
    public static EventName = EventName;

    constructor(matchId: number, cards: CardList, playerId: PlayerID) {
        super();
        
        this.setPayload({
            match_id: matchId,
            cards: this.serializeCardList(cards),
            player_id: playerId.asString(),
        });
    }

    public getName(): string {
        return EventName;
    }

}