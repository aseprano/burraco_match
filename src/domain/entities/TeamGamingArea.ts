import { CardList } from "../value_objects/CardList";
import { Run } from "./Run";
import { RunID } from "../value_objects/RunID";
import { Entity } from '@darkbyte/herr';

export interface TeamGamingArea extends Entity {
    
    /**
     * Creates a run with the provided cards.
     * 
     * @param cards The cards to build a new run
     * @returns Run the newly created run
     * @throws CannotBuildRunException if the provided cards cannot be melt to a run
     * @throws DuplicatedRunException if a group run of the same type of the new one already exists
     */
    createRun(cards: CardList): Run;

    /**
     * Adds some cards to a run by its id
     * 
     * @param cards The cards to meld to the run
     * @param runId The id of the run
     * @throws RunNotFoundException if a run with the specified id does not exist
     * @throws RunException if the cards cannot be melded to the specified run
     */
    addCardsToRun(cards: CardList, runId: RunID): Run;

    /**
     * Returns the list of runs in the gaming area
     * 
     * @return Array<Run>
     */
    getRuns(): Array<Run>;

}