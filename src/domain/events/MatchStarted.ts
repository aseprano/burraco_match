import { DomainEvent } from "./DomainEvent";

export class MatchStarted extends DomainEvent {
    public static EventName = 'com.herrdoktor.buraco.events.MatchStarted';

    constructor(matchId: number, gameId: number, team1Players: string[], team2Players: string[]) {
        super();

        this.setPayload({
            id: matchId,
            game_id: gameId,
            team1: team1Players,
            team2: team2Players
        });
    }

    public getName(): string {
        return MatchStarted.EventName;
    }
    
}