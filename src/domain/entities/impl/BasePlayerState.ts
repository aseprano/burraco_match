import { PlayerState } from "../PlayerState";
import { Card } from "../../value_objects/Card";
import { CardList } from "../../value_objects/CardList";
import { RunID } from "../../value_objects/RunID";
import { Run } from "../Run";

export abstract class BasePlayerState implements PlayerState {

    public abstract takeOneCardFromStock(): Card;

    public abstract pickUpAllCardsFromDiscardPile(): Card[];

    public abstract createRun(cards: CardList): Run;

    public abstract meldCardsToRun(cards: CardList, runId: RunID): Run;

    public abstract throwCardToDiscardPile(card: Card): void;

}