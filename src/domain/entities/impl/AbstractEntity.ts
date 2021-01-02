import { Event } from '@darkbyte/herr';
import { Entity } from "../Entity";

export abstract class AbstractEntity implements Entity {
    
    public abstract getId(): any;

    protected abstract doApplyEvent(event: Event): void;

    public applyEvent(event: Event): void {
        this.doApplyEvent(event);
    }

}