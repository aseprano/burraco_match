import { DomainEvent } from "./DomainEvent";

export class DiscardPileInitialized extends DomainEvent {
    public static EventName = "com.herrdoktor.buraco.events.discardPileInitialized";

    constructor(id: number, matchId: number) {
        super();

        this.setPayload({
            id,
            matchId
        });
    }

    public getName(): string {
        return DiscardPileInitialized.EventName;
    }

}