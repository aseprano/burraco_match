import { DomainEvent } from "./DomainEvent";
import { CardList } from "../value_objects/CardList";

const EventName = 'com.herrdoktor.buraco.events.PotCreated';

export class PotCreated extends DomainEvent {
    public static readonly EventName = EventName;

    constructor(matchId: number, potCards: CardList) {
        super();

        this.setPayload({
            match_id: matchId,
            cards: this.serializeCardList(potCards),
        });
    }

    public getName(): string {
        return EventName;
    }

}