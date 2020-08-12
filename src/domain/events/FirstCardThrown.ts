import { DomainEvent } from "./DomainEvent";
import { Card } from "../value_objects/Card";

const EventName = 'com.herrdoktor.buraco.events.FirstCardThrown';

export class FirstCardThrown extends DomainEvent {
    public static EventName = EventName;

    constructor(matchId: number, card: Card) {
        super();

        this.setPayload({
            match_id: matchId,
            card: this.serializeCard(card),
        });
    }

    public getName(): string {
        return EventName;
    }

}