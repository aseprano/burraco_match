import { TeamGamingArea } from "../TeamGamingArea";
import { RunFactory } from "../../factories/RunFactory";
import { CardList } from "../../value_objects/CardList";
import { Run } from "../Run";
import { RunID } from "../../value_objects/RunID";
import { Event } from "../../../tech/events/Event";
import { GroupRun } from "./GroupRun";
import { RunNotFoundException } from "../../exceptions/RunNotFoundException";
import { DuplicatedRunException } from "../../exceptions/DuplicatedRunException";
import { RunCreated } from "../../events/RunCreated";
import { CardSerializer } from "../../domain-services/CardSerializer";
import { SequenceRun } from "./SequenceRun";
import { CardsMeldedToRun } from "../../events/CardsMeldedToRun";

export class ConcreteTeamGamingArea implements  TeamGamingArea {
    private runs: Run[] = [];

    constructor(
        private id: number,
        private factory: RunFactory,
        private serializer: CardSerializer
    ) {}

    private isEventOfMine(event: Event): boolean {
        return event.getPayload().gaming_area_id === this.id;
    }
    
    private getRunById(id: RunID): Run {
        const run = this.runs.find(run => run.getId() == id);

        if  (!run) {
            throw new RunNotFoundException();
        }

        return run;
    }

    private getNextId(): RunID {
        if (!this.runs.length) {
            return new RunID(0);
        }

        const runIds = this.runs.map(run => run.getId().asNumber());

        return new RunID(Math.max(...runIds) + 1);
    }

    private buildRun(cards: CardList): Run {
        return this.factory.build(cards, this.getNextId());
    }

    private appendRun(run: Run) {
        this.runs.push(run);
    }

    private overwriteRun(newRun: Run) {
        const runIndex = this.runs.findIndex(run => run.getId().asNumber() === newRun.getId().asNumber());

        if (runIndex === -1) {
            this.appendRun(newRun);
        } else {
            this.runs[runIndex] = newRun;
        }
    }

    private restoreRunFromEvent(event: Event): Run {
        const cards = this.serializer.unserializeCards(event.getPayload().run.cards);
        const wildcardPosition: number = event.getPayload().run.wildcard_position;

        const run = event.getPayload().run.type === 'group' ?
            GroupRun.restore(cards, wildcardPosition) :
            SequenceRun.restore(cards, wildcardPosition);

        run.setId(new RunID(event.getPayload().run.id));

        return run;
    }

    private handleRunCreatedEvent(event: Event) {
        this.appendRun(this.restoreRunFromEvent(event));
    }

    private handleCardsMeldedToRunEvent(event: Event) {
        this.overwriteRun(this.restoreRunFromEvent(event));
    }

    private groupAlreadyExists(newRun: GroupRun): boolean {
        return this.runs.some(run => !run.isSequence() && (run as GroupRun).getValue() === newRun.getValue());
    }

    public getId() {
        return this.id;
    }

    public applyEvent(event: Event): void {
        if (!this.isEventOfMine(event)) {
            return;
        }

        switch (event.getName()) {
            case RunCreated.EventName:
                this.handleRunCreatedEvent(event);
                break;

            case CardsMeldedToRun.EventName:
                this.handleCardsMeldedToRunEvent(event);
                break;
        }
    }

    public createRun(cards: CardList): Run {
        const newRun = this.buildRun(cards);

        if (!newRun.isSequence() && this.groupAlreadyExists(newRun as GroupRun)) {
            throw new DuplicatedRunException();
        }

        return newRun;
    }
    
    public addCardsToRun(cards: CardList, runId: RunID): Run {
        return this.getRunById(runId)
            .add(cards);
    }

    public getRuns(): Run[] {
        return [...this.runs];
    }

}