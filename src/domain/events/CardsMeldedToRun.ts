import { DomainEvent } from "./DomainEvent";
import { CardList } from "../value_objects/Card";
import { Run } from "../entities/Run";

const EventName = "com.herrdoktor.buraco.events.CardsMeldedToRun";

export class CardsMeldedToRun extends DomainEvent {
    public static readonly EventName = EventName;

    constructor(
        matchId: number,
        playerId: string,
        gamingAreaId: number,
        cards: CardList,
        updatedRun: Run
    ) {
        super();

        this.setPayload({
            match_id: matchId,
            player_id: playerId,
            gaming_area_id: gamingAreaId,
            cards: this.serializeCardList(cards),
            run: this.serializeRun(updatedRun),
        });
    }

    public getName(): string {
        return EventName;
    }

}