import { IdlePlayerState } from "./IdlePlayerState";
import { BadPlayerTurnException } from "../../exceptions/BadPlayerTurnException";
import { Card } from "../../value_objects/Card";
import { RunID } from "../../value_objects/RunID";
import { CardList } from "../../value_objects/CardList";

describe('IdlePlayerState', () => {

    it('throws an error whatever command is sent', () => {
        const playerState = new IdlePlayerState();

        expect(() => playerState.takeOneCardFromStock())
            .toThrow(new BadPlayerTurnException());

        expect(() => playerState.pickUpAllCardsFromDiscardPile())
            .toThrow(new BadPlayerTurnException());

        expect(() => playerState.createRun(CardList.empty()))
            .toThrow(new BadPlayerTurnException());

        expect(() => playerState.throwCardToDiscardPile(Card.Joker()))
            .toThrow(new BadPlayerTurnException());

        expect(() => playerState.meldCardsToRun(CardList.empty(), new RunID(1233)))
            .toThrow(new BadPlayerTurnException());
    });

});
