import { BasePlayerState } from "./BasePlayerState";
import { Card } from "../../value_objects/Card";
import { CardList } from "../../value_objects/CardList";
import { Run } from "../Run";
import { RunID } from "../../value_objects/RunID";
import { BadPlayerTurnException } from "../../exceptions/BadPlayerTurnException";

export class IdlePlayerState extends BasePlayerState {

    public takeOneCardFromStock(): Card {
        throw new BadPlayerTurnException();
    }

    public pickUpAllCardsFromDiscardPile(): Card[] {
        throw new BadPlayerTurnException();
    }

    public createRun(cards: CardList): Run {
        throw new BadPlayerTurnException();
    }

    public meldCardsToRun(cards: CardList, runId: RunID): Run {
        throw new BadPlayerTurnException();
    }

    public throwCardToDiscardPile(card: Card): void {
        throw new BadPlayerTurnException();
    }

}