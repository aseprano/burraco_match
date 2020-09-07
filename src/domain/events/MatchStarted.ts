import { DomainEvent } from "./DomainEvent";
import { CardList } from "../value_objects/Card";

const EventName = 'com.herrdoktor.buraco.events.MatchStarted';

export class MatchStarted extends DomainEvent {
    public static readonly EventName = EventName;

    constructor(
        matchId: number,
        gameId: number,
        stock: CardList,
        team1Players: string[],
        team2Players: string[]
    ) {
        super();

        this.setPayload({
            id: matchId,
            game_id: gameId,
            stock: this.serializeCardList(stock),
            team1: team1Players,
            team2: team2Players
        });
    }

    public getName(): string {
        return EventName;
    }
    
}