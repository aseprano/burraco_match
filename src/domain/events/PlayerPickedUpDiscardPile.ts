import { DomainEvent } from "./DomainEvent";
import { PlayerID } from "../value_objects/PlayerID";
import { CardList } from "../value_objects/Card";

const EventName = 'com.herrdoktor.buraco.events.PlayerPickedUpDiscardPile';

export class PlayerPickedUpDiscardPile extends DomainEvent {
    public static readonly EventName = EventName;

    constructor(matchId: number, playerId: PlayerID, discardPile: CardList) {
        super();

        this.setPayload({
            match_id: matchId,
            player_id: playerId.asString(),
            cards: this.serializeCardList(discardPile)
        });
    }

    public getName(): string {
        return EventName;
    }
}
