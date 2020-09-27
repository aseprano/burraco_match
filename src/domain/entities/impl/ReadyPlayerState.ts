import { BasePlayerState } from "./BasePlayerState";
import { Card } from "../../value_objects/Card";
import { Run } from "../Run";
import { RunID } from "../../value_objects/RunID";
import { ActionNotAllowedException } from "../../exceptions/ActionNotAllowedException";
import { Stock } from "../Stock";
import { CardList } from "../../value_objects/CardList";

export class ReadyPlayerState extends BasePlayerState {

    public constructor(
        private stock: Stock,
        private discardPile: Card[]        
    ) {
        super();
    }

    public takeOneCardFromStock(): Card {
        return this.stock.takeOne();
    }

    public pickUpAllCardsFromDiscardPile(): Card[] {
        return this.discardPile;
    }

    public createRun(cards: CardList): Run {
        throw new ActionNotAllowedException();
    }

    public meldCardsToRun(cards: CardList, runId: RunID): Run {
        throw new ActionNotAllowedException();
    }

    public throwCardToDiscardPile(card: Card): void {
        throw new ActionNotAllowedException();
    }

}