import { DomainEvent } from "./DomainEvent";

export class MatchStarted extends DomainEvent {
    public static EventName = 'com.herrdoktor.buraco.events.MatchStarted';

    constructor(matchId: number, gameId: number, team1: string[], team2: string[]) {
        super();

        this.setPayload({
            id: matchId,
            gameId,
            team1,
            team2
        });
    }

    public getName(): string {
        return MatchStarted.EventName;
    }
    
}