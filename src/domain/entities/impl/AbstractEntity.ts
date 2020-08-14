import { Entity } from "../Entity";
import { Event } from "../../../tech/events/Event";

export abstract class AbstractEntity implements Entity {
    
    public abstract getId(): any;

    protected abstract doApplyEvent(event: Event): void;

    public applyEvent(event: Event): void {
        this.doApplyEvent(event);
    }

}