import { EventStream } from "../../../tech/events/EventStream";
import { DomainEvent } from "../../events/DomainEvent";
import { Snapshot, SnapshotState } from "../../../tech/Snapshot";
import { AbstractEntity } from "./AbstractEntity";
import { RootEntity } from "../RootEntity";
import { Event } from "../../../tech/events/Event";

export abstract class AbstractRootEntity extends AbstractEntity implements RootEntity {
    private currentStreamVersion: number = -1;
    private uncommittedEvents: DomainEvent[] = [];

    protected abstract buildSnapshot(): SnapshotState;

    protected abstract applySnapshot(snapshot: SnapshotState): void;

    protected abstract propagateEvent(event: Event): void;

    protected appendUncommittedEvent(event: DomainEvent): void {
        this.uncommittedEvents.push(event);
        this.applyEvent(event);
    }
    
    public getVersion(): number {
        return this.currentStreamVersion;
    }

    public commitEvents(): DomainEvent[] {
        const events = this.uncommittedEvents.splice(0);
        this.currentStreamVersion += events.length;
        return events;
    }

    public getSnapshot(): Snapshot {
        const snapshotState = this.buildSnapshot();
        
        return {
            state: snapshotState,
            version: this.getVersion(),
        };
    }

    public restoreFromEventStream(stream: EventStream, snapshot?: Snapshot): void {
        if (snapshot) {
            this.applySnapshot(snapshot.state);
            this.currentStreamVersion = snapshot.version;
        }
        
        if (stream.events.length) {
            stream.events.forEach((event) => {
                this.applyEvent(event);
                this.propagateEvent(event);
            });
            
            this.currentStreamVersion = stream.version;
        }
    }
    
}