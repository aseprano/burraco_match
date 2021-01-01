import { IdlePlayerState } from "../../../src/domain/entities/impl/IdlePlayerState";
import { BadPlayerTurnException } from "../../../src/domain/exceptions/BadPlayerTurnException";
import { Card } from "../../../src/domain/value_objects/Card";
import { RunID } from "../../../src/domain/value_objects/RunID";
import { CardList } from "../../../src/domain/value_objects/CardList";

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
