import { Score } from "../value_objects/Score";
import { DomainEvent } from "./DomainEvent";

const EventName = 'com.herrdoktor.buraco.events.MatchEnded';

export class MatchEnded extends DomainEvent {
    public static readonly EventName = EventName;

    public constructor(matchId: number, team1Score: Score, team2Score: Score) {
        super();

        this.setPayload({
            match_id: matchId,
            team1_score: team1Score,
            team2_score: team2Score,
        });
    }

    public getName(): string {
        return EventName;
    }
}