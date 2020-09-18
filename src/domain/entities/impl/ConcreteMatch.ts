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
import { Card } from "../../value_objects/Card";
import { CardList } from "../../value_objects/CardList";
import { Player } from "../Player";
import { ConcretePlayer } from "./ConcretePlayer";
import { CardsDealtToPlayer } from "../../events/CardsDealtToPlayer";
import { CardSerializer } from "../../domain-services/CardSerializer";
import { PotCreated } from "../../events/PotCreated";
import { FirstCardThrown } from "../../events/FirstCardThrown";
import { GameTurnToPlayer } from "../../events/GameTurnToPlayer";
import { PlayerTookOneCardFromStock } from "../../events/PlayerTookOneCardFromStock";
import { TeamGamingArea } from "../TeamGamingArea";
import { PlayerPickedUpDiscardPile } from "../../events/PlayerPickedUpDiscardPile";
import { Run } from "../Run";
import { RunCreated } from "../../events/RunCreated";
import { CardsMeldedToRun } from "../../events/CardsMeldedToRun";
import { GamingAreaFactory } from "../../factories/GamingAreaFactory";
import { RunID } from "../../value_objects/RunID";
import { PlayerThrewCardToDiscardPile } from "../../events/PlayerThrewCardToDiscardPile";
import { PlayerTookPot } from "../../events/PlayerTookPot";

export class ConcreteMatch extends AbstractRootEntity implements Match {
    private id = 0;
    private started = false;
    private players: Player[] = [];
    private playersMap: Map<string, Player> = new Map();
    private players2TeamMap: Map<string, number> = new Map();
    private areasByPlayersMap: Map<string, TeamGamingArea> = new Map();
    private currentPlayerIndex = -1;
    private pots: CardList[] = [];
    private potsTaken: Array<number> = []; // list of team ids that has taken the pot
    private gamingAreas: TeamGamingArea[];

    constructor(
        private stock: Stock,
        private discardPile: CardList,
        private cardSerializer: CardSerializer,
        private gamingAreaFactory: GamingAreaFactory
    ) {
        super();

        this.gamingAreas = [
            this.gamingAreaFactory.build(0),
            this.gamingAreaFactory.build(1),
        ];
    }

    private handleMatchInitializedEvent(event: Event) {
        this.id = event.getPayload().id;
    }

    private buildPlayer(playerId: string, teammmateId: string, gamingArea: TeamGamingArea) {
        const player = new ConcretePlayer(
            playerId,
            teammmateId,
            this.cardSerializer,
            this.stock,
            this.discardPile,
            gamingArea
        );

        this.players.push(player);
        this.playersMap.set(playerId, player);
        this.areasByPlayersMap.set(playerId, gamingArea);
    }

    private getPlayerById(playerId: string|PlayerID): Player {
        if (playerId instanceof PlayerID) {
            return this.getPlayerById(playerId.asString());
        }

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

    private getGamingAreaByPlayerId(playerId: string): TeamGamingArea {
        const gamingArea = this.areasByPlayersMap.get(playerId);
        
        if (!gamingArea) {
            throw new Error(`No gaming area found for player ${playerId}`);
        }

        return gamingArea;
    }
    
    private getTeamIdFor(playerId: string|PlayerID): number {
        if (playerId instanceof PlayerID) {
            return this.getTeamIdFor(playerId.asString());
        }

        const teamId = this.players2TeamMap.get(playerId);

        if (teamId === undefined) {
            throw new Error(`Player not found: ${playerId}`);
        }

        return teamId;
    }

    private handleMatchStartedEvent(event: Event) {
        this.started = true;
        this.discardPile = this.discardPile.clear();
        const team1: Array<string> = event.getPayload().team1;
        const team2: Array<string> = event.getPayload().team2;

        team1.forEach((player1Id: string, playerIndex: number) => {
            const player2Id: string = event.getPayload().team2[playerIndex];

            this.buildPlayer(player1Id, team1[1-playerIndex], this.gamingAreas[0]);
            this.buildPlayer(player2Id, team2[1-playerIndex], this.gamingAreas[1]);
            this.players2TeamMap.set(player1Id, 0);
            this.players2TeamMap.set(player2Id, 1);
        });
    }

    private handlePotCreatedEvent(event: Event) {
        const potCards = this.cardSerializer.unserializeCards(event.getPayload().cards);
        this.pots.push(potCards);
    }

    private handleFirstCardThrownEvent(event: Event) {
        const cardThrown = this.cardSerializer.unserializeCard(event.getPayload().card);
        this.discardPile = this.discardPile.append(cardThrown);
    }

    private handleGameTurnToPlayerEvent(event: Event) {
        const playerId = event.getPayload().player_id;
        this.currentPlayerIndex = this.players.findIndex((player) => player.getId() === playerId);
    }

    private handlePlayerTookPotEvent(event: Event) {
        this.pots.pop();

        const playerId: string = event.getPayload().player_id;
        const teamId = this.getTeamIdFor(playerId);
        
        this.potsTaken.push(teamId);
    }

    protected deal(targetPlayer: Player, numberOfCards = 1) {
        const cardsDealt = this.stock.take(numberOfCards);
        this.appendUncommittedEvent(new CardsDealtToPlayer(this.id, cardsDealt, targetPlayer.getId()));
    }

    private dealCards(): void {
        for (let i=0; i<11; i++) {
            this.players.forEach((player) => this.deal(player, 1));
        }
    }

    private createPots(): void {
        this.appendUncommittedEvent(new PotCreated(this.id, this.stock.take(11)));
        this.appendUncommittedEvent(new PotCreated(this.id, this.stock.take(11)));
    }

    private throwFirstCard(): void {
        const cardThrown = this.stock.takeOne();
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

        this.appendUncommittedEvent(
            new MatchStarted(
                this.id,
                gameId,
                this.stock.getCards(),
                team1.map(playerName => playerName.asString()),
                team2.map(playerName => playerName.asString()),
            )
        );

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
        this.players.forEach((player) => player.applyEvent(event));
        this.gamingAreas.forEach((gamingArea) => gamingArea.applyEvent(event));
    }

    protected doApplyEvent(event: Event): void {
        switch(event.getName()) {
            case MatchInitialized.EventName:
                this.handleMatchInitializedEvent(event);
                break;

            case MatchStarted.EventName:
                this.handleMatchStartedEvent(event);
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

            case PlayerTookPot.EventName:
                this.handlePlayerTookPotEvent(event);
                break;
        }
    }

    private playerHandIsEmpty(playerId: PlayerID): boolean {
        return this.getPlayerById(playerId).hasNoMoreCards();
    }

    private potHasBeenTakenByTeam(teamId: number): boolean {
        return this.potsTaken.findIndex(id => id === teamId) !== -1;
    }

    private potHasBeenTakenByPlayerTeam(playerId: PlayerID): boolean {
        return this.potHasBeenTakenByTeam(this.getTeamIdFor(playerId));
    }

    private checkIfPotCanBeTaken(playerId: PlayerID)
    {
        if (!this.playerHandIsEmpty(playerId) || this.potHasBeenTakenByPlayerTeam(playerId)) {
            return;
        }

        const pot: CardList = this.pots.slice(-1, 1)[0];

        this.appendUncommittedEvent(new PlayerTookPot(
            this.id,
            playerId.asString(),
            pot
        ));
    }

    private checkIfPlayerEndedMatch(playerId: PlayerID) {
        if (!this.playerHandIsEmpty(playerId) || !this.potHasBeenTakenByPlayerTeam(playerId)) {
            return;
        }

        // append the event
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

    public takeFromStock(playerId: PlayerID): Card {
        const card = this.getPlayerById(playerId.asString())
            .takeOneCardFromStock();

        this.appendUncommittedEvent(new PlayerTookOneCardFromStock(this.id, playerId.asString(), card));

        return card;
    }

    public pickUpDiscardPile(player: PlayerID): CardList {
        const cards = this.getPlayerById(player.asString())
            .pickUpAllCardsFromDiscardPile();

        this.appendUncommittedEvent(new PlayerPickedUpDiscardPile(this.id, player.asString(), cards));

        return cards;
    }

    public createRun(player: PlayerID, cards: CardList): Run {
        const newRun = this.getPlayerById(player.asString())
            .createRun(cards);

        this.appendUncommittedEvent(
            new RunCreated(
                this.id,
                player.asString(),
                this.getGamingAreaByPlayerId(player.asString()).getId(),
                newRun
            )
        );

        this.checkIfPotCanBeTaken(player);

        return newRun;
    }

    public meldCardsToRun(playerId: PlayerID, cards: CardList, runId: RunID): Run {
        const updatedRun = this.getPlayerById(playerId.asString())
            .meldCardsToRun(cards, runId);

        this.appendUncommittedEvent(
            new CardsMeldedToRun(
                this.id,
                playerId.asString(),
                this.getGamingAreaByPlayerId(playerId.asString()).getId(),
                cards,
                updatedRun
            )
        );

        this.checkIfPotCanBeTaken(playerId);

        return updatedRun;
    }

    public throwCardToDiscardPile(playerId: PlayerID, card: Card): void {
        this.getPlayerById(playerId.asString())
            .throwCardToDiscardPile(card);

        this.appendUncommittedEvent(
            new PlayerThrewCardToDiscardPile(
                this.id,
                playerId.asString(),
                card
            )
        );

        this.checkIfPlayerEndedMatch(playerId);
        this.checkIfPotCanBeTaken(playerId);
    }

}