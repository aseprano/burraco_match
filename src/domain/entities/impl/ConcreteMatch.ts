import { Match } from "../Match";
import { AbstractRootEntity } from "./AbstractRootEntity";
import { MatchInitialized} from "../../events/MatchInitialized";
import { PlayerID } from "../../value_objects/PlayerID";
import { Team } from "../../value_objects/Team";
import { SnapshotState } from "../../../tech/Snapshot";
import { Event } from "../../../tech/events/Event";
import { MatchPlayersException } from "../../exceptions/MatchPlayersException";
import { MatchStarted } from "../../events/MatchStarted";
import { Stock } from "../Stock";
import { CardList } from "../../value_objects/Card";
import { Player } from "../Player";
import { ConcretePlayer } from "./ConcretePlayer";
import { DiscardPile } from "../DiscardPile";

export class ConcreteMatch extends AbstractRootEntity implements Match {
    private id = 0;
    private started = false;
    private players: Player[] = [];
    private currentPlayerIndex = -1;

    constructor(
        private stock: Stock,
        private discardPile: DiscardPile,
    ) {
        super();
    }

    private handleMatchInitializedEvent(event: Event) {
        this.id = event.getPayload().id;
    }

    private handleMatchStartedEvent(event: Event) {
        this.started = true;

        this.players = event.getPayload()
            .players
            .map((playerId: string) => new ConcretePlayer(playerId, this.stock, this.discardPile));
    }

    private deal(): void {
        // this.players.forEach((player) => {
        //     player.deal(this.stock.pick(11));
        // });
    }

    private checkTeams(team1: PlayerID[], team2: PlayerID[]) {
        if (team1.some((player) => team2.includes(player))) {
            throw new MatchPlayersException();
        }
    }

    private start(gameId: number, team1: PlayerID[], team2: PlayerID[]): void {
        if (this.started) {
            throw new Error('Match already started');
        }

        this.checkTeams(team1, team2);

        this.appendUncommittedEvent(new MatchStarted(this.id, gameId, [], team1.map(p => p.asString()), team2.map(p => p.asString())));
        this.deal();
    }

    protected buildSnapshot(): SnapshotState {
        throw new Error("Method not implemented.");
    }

    protected applySnapshot(snapshot: SnapshotState): void {
        throw new Error("Method not implemented.");
    }

    protected propagateEvent(event: Event): void {
        this.stock.applyEvent(event);
        this.discardPile.applyEvent(event);
        this.players.forEach((p) => p.applyEvent(event));
    }

    public applyEvent(event: Event): void {
        switch(event.getName()) {
            case MatchInitialized.EventName:
                this.handleMatchInitializedEvent(event);
                break;

            case MatchStarted.EventName:
                this.handleMatchStartedEvent(event);
                break;
        }
    }

    public getId() {
        return this.id;
    }

    public initialize(id: number) {
        this.appendUncommittedEvent(new MatchInitialized(id));
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