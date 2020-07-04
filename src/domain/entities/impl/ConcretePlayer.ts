import { Player } from "../Player";
import { AbstractEntity } from "./AbstractEntity";
import { SnapshotState } from "../../../tech/Snapshot";
import { Event } from "../../../tech/events/Event";
import { Card, CardList } from "../../value_objects/Card";
import { Run } from "../Run";
import { RunID } from "../../value_objects/RunID";
import { Stock } from "../Stock";
import { DiscardPile } from "../DiscardPile";

export class ConcretePlayer extends AbstractEntity implements Player {
    private cards: CardList = [];

    public constructor(
        private playerId: number,
        private stock: Stock,
        private discardPile: DiscardPile
    ) {
        super();

    }

    protected buildSnapshot(): SnapshotState {
        throw new Error("Method not implemented.");
    }

    protected applySnapshot(snapshot: SnapshotState): void {
        throw new Error("Method not implemented.");
    }

    protected applyEvent(event: Event): void {
        throw new Error("Method not implemented.");
    }

    public getId() {
        return this.playerId;
    }
    
    public deal(cards: CardList): void {

    }

    public pickOneCardFromStock(): Card {
        throw new Error("Method not implemented.");
    }

    public pickAllCardsFromDiscardPile(): CardList {
        throw new Error("Method not implemented.");
    }

    public createRun(cards: CardList): Run {
        throw new Error("Method not implemented.");
    }

    public meldCardsToRun(cards: CardList, runId: RunID): Run {
        throw new Error("Method not implemented.");
    }

    public discard(card: Card): void {
        throw new Error("Method not implemented.");
    }

}