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
import { CardsDealtToPlayer } from "../../events/CardsDealtToPlayer";
import { CardSerializer } from "../../domain-services/CardSerializer";
import { PotCreated } from "../../events/PotCreated";
import { FirstCardThrown } from "../../events/FirstCardThrown";
import { GameTurnToPlayer } from "../../events/GameTurnToPlayer";

export class ConcreteMatch extends AbstractRootEntity implements Match {
    private id = 0;
    private started = false;
    private players: Player[] = [];
    private playersMap: Map<string, Player> = new Map();
    private currentPlayerIndex = -1;
    private pots: CardList[] = [];

    constructor(
        private stock: Stock,
        private discardPile: CardList,
        private cardSerializer: CardSerializer
    ) {
        super();
    }

    private handleMatchInitializedEvent(event: Event) {
        this.id = event.getPayload().id;
    }

    private buildPlayer(playerId: string): Player {
        return new ConcretePlayer(
            playerId,
            this.cardSerializer,
            this.stock,
            this.discardPile
        );
    }

    private addPlayer(player: Player) {
        this.players.push(player);
        this.playersMap.set(player.getId(), player);
    }

    private getPlayerById(playerId: string): Player {
        const player = this.playersMap.get(playerId);

        if (!player) {
            throw new Error(`Player not found: ${playerId}`);
        }

        return player;
    }

    private getPlayerAt(index: number): Player {
        if (index < 0 || index >= this.players.length) {
            throw new Error(`No player found at ${index}`);
        }

        return this.players[index];
    }

    private handleMatchStartedEvent(event: Event) {
        this.started = true;
        this.discardPile = [];

        event.getPayload()
            .team1
            .forEach((player1Id: string, index: number) => {
                const player2Id: string = event.getPayload().team2[index];

                this.addPlayer(this.buildPlayer(player1Id));
                this.addPlayer(this.buildPlayer(player2Id));
            });
    }

    private handleCardsDealtToPlayerEvent(event: Event) {
        this.getPlayerById(event.getPayload().player_id).applyEvent(event);
    }

    private handlePotCreatedEvent(event: Event) {
        const potCards = this.cardSerializer.unserializeCards(event.getPayload().cards);
        this.pots.push(potCards);
    }

    private handleFirstCardThrownEvent(event: Event) {
        const cardThrown = this.cardSerializer.unserializeCard(event.getPayload().card);
        this.discardPile = [cardThrown];
    }

    private handleGameTurnToPlayerEvent(event: Event) {
        const playerId = event.getPayload().player_id;
        this.currentPlayerIndex = this.players.findIndex((player) => player.getId() === playerId);
    }

    protected deal(targetPlayer: Player, numberOfCards = 1) {
        const cardsDealt = this.stock.pick(numberOfCards);
        this.appendUncommittedEvent(new CardsDealtToPlayer(this.id, cardsDealt, targetPlayer.getId()));
    }

    private dealCards(): void {
        for (let i=0; i<11; i++) {
            this.players.forEach((player) => this.deal(player, 1));
        }
    }

    private createPots(): void {
        this.appendUncommittedEvent(new PotCreated(this.id, this.stock.pick(11)));
        this.appendUncommittedEvent(new PotCreated(this.id, this.stock.pick(11)));
    }

    private throwFirstCard(): void {
        const cardThrown = this.stock.pickOne();
        this.appendUncommittedEvent(new FirstCardThrown(this.id, cardThrown));
    }

    private turnToNextPlayer(): void {
        const nextPlayer = this.getPlayerAt((this.currentPlayerIndex+1) % this.players.length);
        this.appendUncommittedEvent(new GameTurnToPlayer(this.id, nextPlayer.getId()));
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
        this.stock.shuffle();

        this.appendUncommittedEvent(new MatchStarted(this.id, gameId, this.stock.getCards(), team1.map(p => p.asString()), team2.map(p => p.asString())));

        this.dealCards();
        this.createPots();
        this.throwFirstCard();
        this.turnToNextPlayer();
    }

    protected buildSnapshot(): SnapshotState {
        throw new Error("Method not implemented.");
    }

    protected applySnapshot(snapshot: SnapshotState): void {
        throw new Error("Method not implemented.");
    }

    protected propagateEvent(event: Event): void {
        this.stock.applyEvent(event);
        this.players.forEach((p) => p.applyEvent(event));
    }

    protected doApplyEvent(event: Event): void {
        switch(event.getName()) {
            case MatchInitialized.EventName:
                this.handleMatchInitializedEvent(event);
                break;

            case MatchStarted.EventName:
                this.handleMatchStartedEvent(event);
                break;

            case CardsDealtToPlayer.EventName:
                this.handleCardsDealtToPlayerEvent(event);
                break;

            case PotCreated.EventName:
                this.handlePotCreatedEvent(event);
                break;

            case FirstCardThrown.EventName:
                this.handleFirstCardThrownEvent(event);
                break;

            case GameTurnToPlayer.EventName:
                this.handleGameTurnToPlayerEvent(event);
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