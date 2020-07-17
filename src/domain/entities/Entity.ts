import { Event } from "../../tech/events/Event";

export interface Entity {
    
    applyEvent(event: Event): void;

    getId(): any;
    
}