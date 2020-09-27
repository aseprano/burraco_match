import { Card } from "../value_objects/Card";
import { Run } from "./Run";
import { RunID } from "../value_objects/RunID";
import { CardList } from "../value_objects/CardList";

export interface PlayerState {

    takeOneCardFromStock(): Card;

    pickUpAllCardsFromDiscardPile(): Card[];

    createRun(cards: CardList): Run;

    meldCardsToRun(cards: CardList, runId: RunID): Run;

    throwCardToDiscardPile(card: Card): void;
    
}