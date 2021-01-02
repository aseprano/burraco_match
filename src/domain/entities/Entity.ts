import { Event } from '@darkbyte/herr';

export interface Entity {
    
    applyEvent(event: Event): void;

    getId(): any;
    
}