import { BasePlayerState } from "./BasePlayerState";
import { Card, CardList } from "../../value_objects/Card";
import { Run } from "../Run";
import { RunID } from "../../value_objects/RunID";
import { ActionNotAllowedException } from "../../exceptions/ActionNotAllowedException";
import { Stock } from "../Stock";

export class ReadyPlayerState extends BasePlayerState {

    public constructor(
        private stock: Stock,
        private discardPile: CardList        
    ) {
        super();
    }

    public takeOneCardFromStock(): Card {
        return this.stock.takeOne();
    }

    public pickUpAllCardsFromDiscardPile(): CardList {
        return this.discardPile;
    }

    public createRun(cards: CardList): Run {
        throw new ActionNotAllowedException();
    }

    public meldCardsToRun(cards: CardList, runId: RunID): Run {
        throw new ActionNotAllowedException();
    }

    public discard(card: Card): void {
        throw new ActionNotAllowedException();
    }

}