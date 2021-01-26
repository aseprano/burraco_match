import { AbstractRepository, EventStore, Injectable, SnapshotsRepository } from '@darkbyte/herr';
import { MatchesRepository } from "../MatchesRepository";
import { MatchID } from "../../value_objects/MatchID";
import { Match } from "../../entities/Match";
import { MatchFactory } from "../../factories/MatchFactory";

@Injectable()
export class MatchesRepositoryImpl extends AbstractRepository implements MatchesRepository {

    constructor(
        eventStore: EventStore,
        snapshotsRepository: SnapshotsRepository,
        private readonly matchFactory: MatchFactory
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

    public async add(match: Match): Promise<void> {
        return this.saveEntity(match);
    }

    public async update(match: Match): Promise<void> {
        return this.saveEntity(match);
    }

}
