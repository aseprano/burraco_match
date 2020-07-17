import { Entity } from "../Entity";
import { Event } from "../../../tech/events/Event";

export abstract class AbstractEntity implements Entity {
    
    public abstract getId(): any;

    public abstract applyEvent(event: Event): void;

}