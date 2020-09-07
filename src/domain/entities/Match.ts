import { Entity } from "./Entity";
import { PlayerID } from "../value_objects/PlayerID";
import { Team } from "../value_objects/Team";
import { RootEntity } from "./RootEntity";
import { Card, CardList } from "../value_objects/Card";
import { Run } from "./Run";
import { RunID } from "../value_objects/RunID";

export interface Match extends RootEntity {

    start1vs1(gameId: number, player1: PlayerID, player2: PlayerID): void;
    
    start2vs2(gameId: number, team1: Team, team2: Team): void;
    
    takeFromStock(player: PlayerID): Card;

    pickUpDiscardPile(player: PlayerID): CardList;
    
    createRun(player: PlayerID, cards: CardList): Run;
    
    /**
     * Adds a list of cards to a specific run
     * 
     * @param player The player that wants to add the cards to the run
     * @param cards The cards to add to the run
     * @param runId The id of the Run
     * @throws ActionNotAllowedException if the current state of the player does not allow to meld some cards to a run
     * @throws RunNotFoundException
     * @throws InvalidCardListException if the provided list of cards is empty
     * @throws CardsNotOwnedException
     * @throws RunException
     */
    meldCardsToRun(player: PlayerID, cards: CardList, runId: RunID): Run;
    
    /**
     * Throws a card to the discard pile
     * 
     * @param player The player that wants to throw the card
     * @param card The card to throw
     * @throws ActionNotAllowedException
     * @throws CardsNotOwnedException
     * @throws CannotThrowCardException
     */
    throwCardToDiscardPile(player: PlayerID, card: Card): void;

}