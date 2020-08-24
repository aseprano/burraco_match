import { DomainEvent } from "./DomainEvent";
import { PlayerID } from "../value_objects/PlayerID";
import { Card } from "../value_objects/Card";

const EventName = 'com.herrdoktor.buraco.events.PlayerTookOneCardFromStock';

export class PlayerTookOneCardFromStock extends DomainEvent {
    public static readonly EventName = EventName;

    constructor(matchId: number, playerId: PlayerID, card: Card) {
        super();

        this.setPayload({
            match_id: matchId,
            player_id: playerId.asString(),
            card: this.serializeCard(card)
        });
    }

    public getName(): string {
        return EventName;
    }
    
}