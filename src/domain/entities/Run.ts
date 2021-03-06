import { RunID } from "../value_objects/RunID";
import { Card } from "../value_objects/Card";
import { CardList } from "../value_objects/CardList";
import { Entity } from '@darkbyte/herr';

export interface Run extends Entity {

    getId(): RunID;
    
    /**
     * Returns true if the run is a sequence
     */
    isSequence(): boolean;
    
    /**
     * Adds one or more cards to the GameRun
     * Throws a RunException if at least one card cannot be added
     * 
     * @param cards 
     */
    add(cards: Card|CardList): Run;

    /**
     * Returns the list of cards that the run is made of, from the lowest to the highest
     */
    getCards(): CardList;

    /**
     * Returns the list of cards that the run is made of, from the lowest to the highest, as a readonly array
     */
    asArray(): ReadonlyArray<Card>;

    /**
     * Returns the position of the wildcard
     * Ranges from 0 (bottommost card) to length-1 (topmost card)
     * 
     * Returns -1 if the run does not contain a wildcard
     */
    getWildcardPosition(): number;

}
