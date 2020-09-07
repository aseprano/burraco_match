import { DomainEvent } from "./DomainEvent";

const EventName = 'com.herrdoktor.buraco.events.MatchInitialized';

export class MatchInitialized extends DomainEvent {
    public static readonly EventName = EventName;

    constructor(matchId: number) {
        super();
        
        this.setPayload({
            id: matchId
        });
    }

    public getName(): string {
        return EventName;
    }
    
}
