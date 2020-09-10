import { DomainEvent } from "./DomainEvent";
import { CardList } from "../value_objects/Card";

const EventName = 'com.herrdoktor.buraco.events.PlayerTookPot';

export class PlayerTookPot extends DomainEvent {
    public static readonly EventName = EventName;

    public constructor(matchId: number, playerId: string, pot: CardList) {
        super();

        this.setPayload({
            match_id: matchId,
            player_id: playerId,
            cards: this.serializeCardList(pot),
        });
    }

    public getName() {
        return EventName;
    }
}
