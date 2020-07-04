import { Match } from "../Match";
import { AbstractEntity } from "./AbstractEntity";
import { MatchInitialized} from "../../events/MatchInitialized";
import { PlayerID } from "../../value_objects/PlayerID";
import { Team } from "../../value_objects/Team";
import { SnapshotState } from "../../../tech/Snapshot";
import { Event } from "../../../tech/events/Event";
import { MatchPlayersException } from "../../exceptions/MatchPlayersException";
import { MatchStarted } from "../../events/MatchStarted";
import { Stock } from "../Stock";
import { CardList } from "../../value_objects/Card";

export class ConcreteMatch extends AbstractEntity implements Match {
    private id = 0;
    private gameId = 0;

    constructor(private stock: Stock) {
        super();
    }

    private handleMatchInitializedEvent(event: Event) {
        this.id = event.getPayload().id;
        this.stock.applyEvent(event);
    }

    protected buildSnapshot(): SnapshotState {
        throw new Error("Method not implemented.");
    }

    protected applySnapshot(snapshot: SnapshotState): void {
        throw new Error("Method not implemented.");
    }

    public applyEvent(event: Event): void {
        switch(event.getName()) {
            case MatchInitialized.EventName:
                this.handleMatchInitializedEvent(event);
                break;
        }
    }

    public getId() {
        return this.id;
    }

    public initialize(id: number, cards: CardList) {
        this.appendUncommittedEvent(new MatchInitialized(id, cards));
    }

    private checkTeams(team1: PlayerID[], team2: PlayerID[]) {
        if (team1.some((player) => team2.includes(player))) {
            throw new MatchPlayersException();
        }
    }

    private start(gameId: number, team1: PlayerID[], team2: PlayerID[]): void {
        this.checkTeams(team1, team2);
        this.appendUncommittedEvent(new MatchStarted(this.id, this.gameId, team1.map(p => p.asString()), team2.map(p => p.asString())));
    }

    public start1vs1(gameId: number, player1: PlayerID, player2: PlayerID): void {
        this.start(
            gameId,
            [player1],
            [player2]
        );
    }

    public start2vs2(gameId: number, team1: Team, team2: Team): void {
        this.start(
            gameId,
            [team1.getPlayer1(), team1.getPlayer2()],
            [team2.getPlayer1(), team2.getPlayer2()]
        );
    }

}