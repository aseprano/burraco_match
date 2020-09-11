import { Card } from "../value_objects/Card";
import { CardList } from "../value_objects/CardList";
import { Run } from "./Run";
import { RunID } from "../value_objects/RunID";
import { Entity } from "./Entity";

export interface Player extends Entity {

    /**
     * @throws ActionNotAllowedException
     * @throws InsufficientCardsInStockException
     */
    takeOneCardFromStock(): Card;

    /**
     * @throws ActionNotAllowedException
     */
    pickUpAllCardsFromDiscardPile(): CardList;

    /**
     * @throws ActionNotAllowedException
     * @throws CardNotOwnedException if at least one of the provided cards is not found in the player's hand
     * @throws CannotBuildRunException if the provided card cannot be used to create a Run
     */
    createRun(cards: CardList): Run;

    /**
     * @throws ActionNotAllowedException
     * @throws CardNotOwnedException if at least one of the provided cards is not found in the player's hand
     * @throws RunNotFoundException if no run with the provided id can be found in the player's gaming area
     * @throws RunException if at least one of the provided cards cannot be added to the run
     */
    meldCardsToRun(cards: CardList, runId: RunID): Run;

    /**
     * @throws ActionNotAllowedException
     * @throws CardNotOwnedException if the provided card is not found in the player's hand
     * @throws CannotDiscardCardException if the provided card cannot be discarded
     */
    throwCardToDiscardPile(card: Card): void;

}