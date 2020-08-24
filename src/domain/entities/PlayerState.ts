import { Card, CardList } from "../value_objects/Card";
import { Run } from "./Run";
import { RunID } from "../value_objects/RunID";

export interface PlayerState {

    takeOneCardFromStock(): Card;

    pickUpAllCardsFromDiscardPile(): CardList;

    createRun(cards: CardList): Run;

    meldCardsToRun(cards: CardList, runId: RunID): Run;

    discard(card: Card): void;
    
}