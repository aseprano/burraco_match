import { PlayerState } from "../PlayerState";
import { Stock } from "../Stock";
import { CardList, Card } from "../../value_objects/Card";
import { Run } from "../Run";
import { RunID } from "../../value_objects/RunID";

export abstract class BasePlayerState implements PlayerState {

    public abstract takeOneCardFromStock(): Card;

    public abstract pickUpAllCardsFromDiscardPile(): CardList;

    public abstract createRun(cards: CardList): Run;

    public abstract meldCardsToRun(cards: CardList, runId: RunID): Run;

    public abstract discard(card: Card): void;

}