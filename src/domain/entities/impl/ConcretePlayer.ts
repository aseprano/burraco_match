import { Player } from "../Player";
import { Event } from "../../../tech/events/Event";
import { Card, CardList } from "../../value_objects/Card";
import { Run } from "../Run";
import { RunID } from "../../value_objects/RunID";
import { Stock } from "../Stock";
import { AbstractEntity } from "./AbstractEntity";
import { CardsDealtToPlayer } from "../../events/CardsDealtToPlayer";
import { CardSerializer } from "../../domain-services/CardSerializer";

export class ConcretePlayer extends AbstractEntity implements Player {
    private hand: CardList = [];

    public constructor(
        private playerId: string,
        private cardSerializer: CardSerializer,
        private stock: Stock,
        private discardPile: CardList
    ) {
        super();
    }
    
    private appendCardsFromEvent(eventCards: any[]) {
        const cards: CardList = this.cardSerializer.unserializeCards(eventCards);
        this.hand.push(...cards);
    }

    private handleCardsDealtToPlayerEvent(event: Event) {
        if (event.getPayload().player_id === this.playerId) {
            this.appendCardsFromEvent(event.getPayload().cards);
        }
    }

    protected doApplyEvent(event: Event): void {
        switch (event.getName()) {
            case CardsDealtToPlayer.EventName:
                this.handleCardsDealtToPlayerEvent(event);
                break;
        }
    }

    public getId() {
        return this.playerId;
    }

    public takeOneCardFromStock(): Card {
        throw new Error("Method not implemented.");
    }

    public pickUpAllCardsFromDiscardPile(): CardList {
        throw new Error("Method not implemented.");
    }

    public createRun(cards: CardList): Run {
        throw new Error("Method not implemented.");
    }

    public meldCardsToRun(cards: CardList, runId: RunID): Run {
        throw new Error("Method not implemented.");
    }

    public discard(card: Card): void {
        throw new Error("Method not implemented.");
    }

    public getHand(): CardList {
        return this.hand.slice(0);
    }

}