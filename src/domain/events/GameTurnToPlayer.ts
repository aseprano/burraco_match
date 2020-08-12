import { DomainEvent } from "./DomainEvent";

const EventName = 'com.herrdoktor.buraco.events.GameTurnToPlayer';

export class GameTurnToPlayer extends DomainEvent {
    public static EventName = EventName;

    constructor(matchId: number, playerId: string) {
        super();

        this.setPayload({
            match_id: matchId,
            player_id: playerId
        });
    }
    public getName(): string {
        return EventName;
    }
}