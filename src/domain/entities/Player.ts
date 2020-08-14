import { Card, CardList } from "../value_objects/Card";
import { Run } from "./Run";
import { RunID } from "../value_objects/RunID";
import { Entity } from "./Entity";

export interface Player extends Entity {

    takeOneCardFromStock(): Card;

    pickUpAllCardsFromDiscardPile(): CardList;

    createRun(cards: CardList): Run;

    meldCardsToRun(cards: CardList, runId: RunID): Run;

    discard(card: Card): void;

}