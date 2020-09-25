import { Event, EventPayload } from "../../tech/events/Event";
import { Card } from "../value_objects/Card";
import { CardList } from "../value_objects/CardList";
import { Run } from "../entities/Run";
import { CardSerializer } from "../domain-services/CardSerializer";
import { BasicCardSerializer } from "../domain-services/impl/BasicCardSerializer";

export abstract class DomainEvent implements Event {
    public static cardSerializer: CardSerializer = new BasicCardSerializer();
    private payload: EventPayload = Object.freeze({});

    protected serializeCard(card: Card): any {
        return DomainEvent.cardSerializer.serializeCard(card);
    }

    protected serializeCardList(cards: CardList): any[] {
        return DomainEvent.cardSerializer.serializeCards(cards);
    }

    protected serializeRun(run: Run): any {
        return {
            id: run.getId().asNumber(),
            type: run.isSequence() ? 'sequence' : 'group',
            cards: this.serializeCardList(run.getCards()),
            wildcard_position: run.getWildcardPosition(),
        };
    }
    
    protected setPayload(payload: EventPayload): void {
        this.payload = Object.freeze(payload);
    }

    public getPayload(): EventPayload {
        return this.payload;
    }
    
    public abstract getName(): string;

}