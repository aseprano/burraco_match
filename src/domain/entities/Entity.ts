import { EventStream } from "../../tech/events/EventStream";
import { Event } from "../../tech/events/Event";
import { Snapshot } from "../../tech/Snapshot";
import { DomainEvent } from "../events/DomainEvent";

export interface Entity {

    restoreFromEventStream(stream: EventStream, snapshot?: Snapshot): void;
    
    applyEvent(event: Event): void;
    
    commitEvents(): DomainEvent[];

    getVersion(): number;

    getSnapshot(): Snapshot;

    getId(): any;
    
}