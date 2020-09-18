import { DomainEvent } from "./DomainEvent";
import { CardList } from "../value_objects/CardList";

const EventName = 'com.herrdoktor.buraco.events.PlayerPickedUpDiscardPile';

export class PlayerPickedUpDiscardPile extends DomainEvent {
    public static readonly EventName = EventName;

    constructor(matchId: number, playerId: string, discardPile: CardList) {
        super();

        this.setPayload({
            match_id: matchId,
            player_id: playerId,
            cards: this.serializeCardList(discardPile)
        });
    }

    public getName(): string {
        return EventName;
    }
}
