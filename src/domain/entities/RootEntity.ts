import { Entity } from "./Entity";
import { EventStream } from "../../tech/events/EventStream";
import { Snapshot } from "../../tech/Snapshot";
import { DomainEvent } from "../events/DomainEvent";

export interface RootEntity extends Entity {
    
    commitEvents(): DomainEvent[];

    getVersion(): number;

    getSnapshot(): Snapshot;

    restoreFromEventStream(stream: EventStream, snapshot?: Snapshot): void;

}