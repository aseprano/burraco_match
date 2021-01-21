import { EventStore, EventStream, Snapshot, SnapshotsRepository } from '@darkbyte/herr';
import { RootEntity } from "../../entities/RootEntity";

export interface EntityStream {
    snapshot?: Snapshot;
    stream: EventStream;
}

export abstract class AbstractRepository {

    constructor(
        private readonly eventStore: EventStore,
        private readonly snapshotRepo: SnapshotsRepository
    ) {}

    private shouldTakeSnapshot(entity: RootEntity): boolean {
        return this.getSnapshotInterval() > 0 && (entity.getVersion() % this.getSnapshotInterval()) === 0
    }

    /**
     * Loads the events needed to reconstitute an entity, along with its last snapshot (if any).
     *  
     * @param id 
     */
    protected async getEventsForId(id: any): Promise<EntityStream> {
        const streamId = this.streamNameForId(id);
        const snapshot = await this.snapshotRepo.getById(streamId);
        const stream = await this.eventStore.readStreamOffset(streamId, snapshot ? snapshot.version : 0);
        
        return {
            snapshot,
            stream,
        };
    }

    /**
     * Creates or appends events to the entity event stream, performing a snapshot on need.
     * 
     * @param entity 
     * @throws StreamAlreadyExistingException if the entity is being persisted for the first time and a stream with the same name already exists
     * @throws StreamNotFoundException if the entity is being updated but no stream exists for it
     */
    protected async saveEntity(entity: RootEntity): Promise<void> {
        const streamId = this.streamNameForId(entity.getId());

        if (entity.getVersion() >= 0) {
            const restoredVersion = entity.getVersion();
            const eventsToCommit = entity.commitEvents();
    
            return this.eventStore
                .appendToStream(streamId, eventsToCommit, restoredVersion)
                .then(() => {
                    if (this.shouldTakeSnapshot(entity)) {
                        return this.snapshotRepo.add(streamId, entity.getSnapshot());
                    }
                });
        } else {
            return this.eventStore
                .createStream(streamId, entity.commitEvents());
        }
    }

    protected async deleteEntity(entity: RootEntity): Promise<void> {

    }

    protected abstract streamNameForId(id: any): string;

    protected abstract getSnapshotInterval(): number;

}