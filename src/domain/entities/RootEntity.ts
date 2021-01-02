import { Entity } from "./Entity";
import { DomainEvent } from "../events/DomainEvent";
import { EventStream, Snapshot } from '@darkbyte/herr';

export interface RootEntity extends Entity {
    
    commitEvents(): DomainEvent[];

    getVersion(): number;

    getSnapshot(): Snapshot;

    restoreFromEventStream(stream: EventStream, snapshot?: Snapshot): void;

}