import { IdlePlayerState } from "./IdlePlayerState";
import { BadPlayerTurnException } from "../../exceptions/BadPlayerTurnException";
import { Card } from "../../value_objects/Card";
import { RunID } from "../../value_objects/RunID";

describe('IdlePlayerState', () => {

    it('throws an error whatever command is sent', () => {
        const playerState = new IdlePlayerState();

        expect(() => playerState.takeOneCardFromStock())
            .toThrow(new BadPlayerTurnException());

        expect(() => playerState.pickUpAllCardsFromDiscardPile())
            .toThrow(new BadPlayerTurnException());

        expect(() => playerState.createRun([]))
            .toThrow(new BadPlayerTurnException());

        expect(() => playerState.discard(Card.Joker()))
            .toThrow(new BadPlayerTurnException());

        expect(() => playerState.meldCardsToRun([], new RunID(1233)))
            .toThrow(new BadPlayerTurnException());
    });

});
