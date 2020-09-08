import { MatchesRepository } from "../MatchesRepository";
import { AbstractRepository } from "./AbstractRepository";
import { MatchID } from "../../value_objects/MatchID";
import { Match } from "../../entities/Match";
import { EventStore } from "../../../tech/events/EventStore";
import { SnapshotRepository } from "../../../tech/SnapshotRepository";
import { MatchFactory } from "../../factories/MatchFactory";

export class MatchesRepositoryImpl extends AbstractRepository implements MatchesRepository {

    constructor(
        eventStore: EventStore,
        snapshotsRepository: SnapshotRepository,
        private matchFactory: MatchFactory
    ) {
        super(eventStore, snapshotsRepository);
    }

    protected streamNameForId(id: any): string {
        return `buraco-match-${id}`;
    }

    protected getSnapshotInterval(): number {
        return 0;
    }
    
    public async getById(id: MatchID): Promise<Match> {
        return this.getEventsForId(id.asNumber())
            .then((eventStream) => {
                const match = this.matchFactory.createEmpty();
                match.restoreFromEventStream(eventStream.stream);
                return match;
            });
    }

    add(match: Match): Promise<void> {
        return this.saveEntity(match);
    }

    update(match: Match): Promise<void> {
        return this.saveEntity(match);
    }

}
