import { DomainEvent } from "./DomainEvent";
import { Card } from "../value_objects/Card";

const EventName = 'com.herrdoktor.buraco.events.PlayerThrewCardToDiscardPile';

export class PlayerThrewCardToDiscardPile extends DomainEvent {
    public static readonly EventName = EventName;

    constructor(matchId: number, playerId: string, card: Card) {
        super();

        this.setPayload({
            match_id: matchId,
            player_id: playerId,
            card: this.serializeCard(card),
        });
    }

    public getName(): string {
        return EventName;
    }

}