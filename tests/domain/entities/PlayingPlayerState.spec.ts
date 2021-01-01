import { ConcreteTeamGamingArea } from "../../../src/domain/entities/impl/ConcreteTeamGamingArea";
import { ConcreteRunFactory } from "../../../src/domain/factories/impl/ConcreteRunFactory";
import { StdCardSerializer } from "../../../src/domain/domain-services/impl/StdCardSerializer";
import { PlayingPlayerState } from "../../../src/domain/entities/impl/PlayingPlayerState";
import { Card, Suit } from "../../../src/domain/value_objects/Card";
import { CardNotOwnedException } from "../../../src/domain/exceptions/CardNotOwnedException";
import { CannotThrowCardException } from "../../../src/domain/exceptions/CannotThrowCardException";
import { TeamGamingArea } from "../../../src/domain/entities/TeamGamingArea";
import { ActionNotAllowedException } from "../../../src/domain/exceptions/ActionNotAllowedException";
import { mock, when, instance, anything } from "ts-mockito";
import { SequenceRun } from "../../../src/domain/entities/impl/SequenceRun";
import { CardList } from "../../../src/domain/value_objects/CardList";
import { ActionPreventedException } from "../../../src/domain/exceptions/ActionPreventedException";
import { isSymbol } from "util";
import { Run } from "../../../src/domain/entities/Run";

describe('PlayingPlayerState', () => {
    const runFactory = new ConcreteRunFactory();
    const cardSerializer = new StdCardSerializer();

    function buildGamingArea(): ConcreteTeamGamingArea {
        return new ConcreteTeamGamingArea(
            1,
            runFactory,
            cardSerializer,
        );
    }

    it('does not allow to take one card from the stock', () => {
        const playerState = new PlayingPlayerState(CardList.empty(), {} as TeamGamingArea, false);

        expect(() => playerState.takeOneCardFromStock())
            .toThrow(new ActionNotAllowedException());
    });

    it('does not allow to pick up the discard pile', () => {
        const playerState = new PlayingPlayerState(CardList.empty(), {} as TeamGamingArea, false);

        expect(() => playerState.pickUpAllCardsFromDiscardPile())
            .toThrow(new ActionNotAllowedException());
    });

    it('does not allow to create a run with cards not in the hand', () => {
        const playerState = new PlayingPlayerState(
            new CardList([
                new Card(Suit.Clubs, 7)
            ]),
            {} as TeamGamingArea,
            false
        );

        const runCards = new CardList([
            new Card(Suit.Clubs, 7),
            new Card(Suit.Clubs, 8)
        ]);

        expect(() => playerState.createRun(runCards))
            .toThrow(new CardNotOwnedException());
    });

    it('does not allow to create a run by using the same card multiple times', () => {
        const playerState = new PlayingPlayerState(
            new CardList([
                new Card(Suit.Clubs, 7)
            ]),
            {} as TeamGamingArea,
            false
        );

        const runCards = new CardList([
            new Card(Suit.Clubs, 7),
            new Card(Suit.Clubs, 7),
            new Card(Suit.Clubs, 7),
        ]);

        expect(() => playerState.createRun(runCards))
            .toThrow(new CardNotOwnedException());
    });

    it('does not allow to discard the last card taken', () => {
        const playerState = new PlayingPlayerState(
            new CardList([
                new Card(Suit.Clubs, 7),
                new Card(Suit.Clubs, 8),
                new Card(Suit.Clubs, 9),
            ]),
            {} as TeamGamingArea,
            false,
            new Card(Suit.Clubs, 8)
        );

        expect(() => playerState.throwCardToDiscardPile(new Card(Suit.Clubs, 8)))
            .toThrow(new CannotThrowCardException());
    });

    it('does not allow to discard a card not in the hand', () => {
        const playerState = new PlayingPlayerState(
            new CardList([
                new Card(Suit.Clubs, 7)
            ]),
            {} as TeamGamingArea,
            false
        );

        expect(() => playerState.throwCardToDiscardPile(new Card(Suit.Clubs, 8)))
            .toThrow(new CardNotOwnedException());
    });

    it('allows to discard a card different from the last card taken', () => {
        const playerState = new PlayingPlayerState(
            new CardList([
                new Card(Suit.Clubs, 8),
                new Card(Suit.Clubs, 7),
            ]),
            {} as TeamGamingArea,
            false,
            new Card(Suit.Clubs, 7), // last card taken
        );

        expect(() => playerState.throwCardToDiscardPile(new Card(Suit.Clubs, 8)))
            .not.toThrow();
    });

    it('delegates the TeamGamingArea for the creation of a run', () => {
        const playerCards = new CardList([
            new Card(Suit.Clubs, 7),
            new Card(Suit.Clubs, 9),
            new Card(Suit.Clubs, 8),
        ]);

        const fakeRun = SequenceRun.restore(playerCards, -1);

        const mockedGamingArea = mock(ConcreteTeamGamingArea);
        when(mockedGamingArea.createRun(playerCards)).thenReturn(fakeRun);

        const playerState = new PlayingPlayerState(
            playerCards,
            instance(mockedGamingArea),
            false
        );

        const run = playerState.createRun(playerCards);
        expect(run).toEqual(fakeRun);
    });

    it('does not allow to use some cards if the last remaining card is the last card taken', () => {
        const state = new PlayingPlayerState(
            new CardList([
                new Card(Suit.Clubs, 9),
                new Card(Suit.Clubs, 10),
                new Card(Suit.Clubs, 11),
                new Card(Suit.Diamonds, 7),
            ]),
            {} as TeamGamingArea,
            false,
            new Card(Suit.Diamonds, 7)
        );

        expect(() => state.createRun(new CardList([
            new Card(Suit.Clubs, 9),
            new Card(Suit.Clubs, 10),
            new Card(Suit.Clubs, 11),
        ]))).toThrow(new ActionPreventedException());
    });

    it('does not allow to use some cards if no card would remain to throw and the pot has been taken', () => {
        const state = new PlayingPlayerState(
            new CardList([
                new Card(Suit.Clubs, 9),
                new Card(Suit.Clubs, 10),
                new Card(Suit.Clubs, 11),
            ]),
            {} as TeamGamingArea,
            true
        );

        expect(() => state.createRun(new CardList([
            new Card(Suit.Clubs, 9),
            new Card(Suit.Clubs, 10),
            new Card(Suit.Clubs, 11),
        ]))).toThrow(new ActionPreventedException());
    });

    it('does not allow to use some cards if a wildcard would be the last card to throw', () => {
        const state = new PlayingPlayerState(
            new CardList([
                new Card(Suit.Clubs, 9),
                new Card(Suit.Clubs, 10),
                new Card(Suit.Clubs, 11),
                Card.Joker(),
            ]),
            {} as TeamGamingArea,
            true
        );

        expect(() => state.createRun(new CardList([
            new Card(Suit.Clubs, 9),
            new Card(Suit.Clubs, 10),
            new Card(Suit.Clubs, 11),
        ]))).toThrow(new ActionPreventedException());
    });

    it('does not allow to use some cards if a deuce would be the last card to throw', () => {
        const state = new PlayingPlayerState(
            new CardList([
                new Card(Suit.Clubs, 9),
                new Card(Suit.Clubs, 10),
                new Card(Suit.Clubs, 11),
                new Card(Suit.Diamonds, 2),
            ]),
            {} as TeamGamingArea,
            true
        );

        expect(() => state.createRun(new CardList([
            new Card(Suit.Clubs, 9),
            new Card(Suit.Clubs, 10),
            new Card(Suit.Clubs, 11),
        ]))).toThrow(new ActionPreventedException());
    });

    it('allows to consume all the cards in the hand if the pot has not been taken', () => {
        const fakeGamingArea = mock(ConcreteTeamGamingArea);

        when(fakeGamingArea.createRun(anything()))
            .thenReturn({} as Run);

        const state = new PlayingPlayerState(
            new CardList([
                new Card(Suit.Clubs, 9),
                new Card(Suit.Clubs, 10),
                new Card(Suit.Clubs, 11)
            ]),
            instance(fakeGamingArea),
            false
        );

        expect(() => state.createRun(new CardList([
            new Card(Suit.Clubs, 9),
            new Card(Suit.Clubs, 10),
            new Card(Suit.Clubs, 11),
        ]))).not.toThrow();
    });

});
