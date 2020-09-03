import { DomainEvent } from "./DomainEvent";
import { Run } from "../entities/Run";

const EventName = 'com.herrdoktor.buraco.events.CardsMeldedToRun';

export class CardsMeldedToRun extends DomainEvent {
    public static readonly EventName = EventName;

    constructor(matchId: number, playerId: string, run: Run) {
        super();

        this.setPayload({
            match_id: matchId,
            player_id: playerId,
            run: this.serializeRun(run),
        });
    }

    public getName(): string {
        return EventName;
    }

}