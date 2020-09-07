import { ConcreteTeamGamingArea } from "./ConcreteTeamGamingArea";
import { ConcreteRunFactory } from "../../factories/impl/ConcreteRunFactory";
import { StdCardSerializer } from "../../domain-services/impl/StdCardSerializer";
import { PlayingPlayerState } from "./PlayingPlayerState";
import { Card, Suit } from "../../value_objects/Card";
import { CardNotOwnedException } from "../../exceptions/CardNotOwnedException";
import { CannotThrowCardException } from "../../exceptions/CannotThrowCardException";
import { TeamGamingArea } from "../TeamGamingArea";
import { ActionNotAllowedException } from "../../exceptions/ActionNotAllowedException";
import { mock, when, instance } from "ts-mockito";
import { SequenceRun } from "./SequenceRun";

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
        const playerState = new PlayingPlayerState([], {} as TeamGamingArea);
        expect(() => playerState.takeOneCardFromStock()).toThrow(new ActionNotAllowedException());
    });

    it('does not allow to pick up the discard pile', () => {
        const playerState = new PlayingPlayerState([], {} as TeamGamingArea);
        expect(() => playerState.pickUpAllCardsFromDiscardPile()).toThrow(new ActionNotAllowedException());
    });

    it('does not allow to create a run with cards not in the hand', () => {
        const playerState = new PlayingPlayerState(
            [
                new Card(Suit.Clubs, 7)
            ],
            {} as TeamGamingArea
        );

        const runCards = [
            new Card(Suit.Clubs, 7),
            new Card(Suit.Clubs, 8)
        ];

        expect(() => playerState.createRun(runCards)).toThrow(new CardNotOwnedException());
    });

    it('does not allow to create a run by using the same card multiple times', () => {
        const playerState = new PlayingPlayerState(
            [
                new Card(Suit.Clubs, 7)
            ],
            {} as TeamGamingArea
        );

        const runCards = [
            new Card(Suit.Clubs, 7),
            new Card(Suit.Clubs, 7),
            new Card(Suit.Clubs, 7),
        ];

        expect(() => playerState.createRun(runCards)).toThrow(new CardNotOwnedException());
    });

    it('does not allow to discard the last card taken', () => {
        const playerState = new PlayingPlayerState(
            [
                new Card(Suit.Clubs, 7),
                new Card(Suit.Clubs, 8),
                new Card(Suit.Clubs, 9),
            ],
            {} as TeamGamingArea,
            new Card(Suit.Clubs, 8)
        );

        expect(() => playerState.throwCardToDiscardPile(new Card(Suit.Clubs, 8)))
            .toThrow(new CannotThrowCardException());
    });

    it('does not allow to discard a card not in the hand', () => {
        const playerState = new PlayingPlayerState(
            [
                new Card(Suit.Clubs, 7)
            ],
            {} as TeamGamingArea
        );

        expect(() => playerState.throwCardToDiscardPile(new Card(Suit.Clubs, 8)))
            .toThrow(new CardNotOwnedException());
    });

    it('allows to discard the last card taken if another identical card exists in the hand', () => {
        const gamingArea = buildGamingArea();

        const playerState = new PlayingPlayerState(
            [
                new Card(Suit.Clubs, 7),
                new Card(Suit.Clubs, 7),
            ],
            gamingArea,
            new Card(Suit.Clubs, 7)
        );

        expect(() => playerState.throwCardToDiscardPile(new Card(Suit.Clubs, 7)))
            .not.toThrow();
    });

    it('allows to discard a card different from the last card taken', () => {
        const playerState = new PlayingPlayerState(
            [
                new Card(Suit.Clubs, 8),
                new Card(Suit.Clubs, 7),
            ],
            {} as TeamGamingArea,
            new Card(Suit.Clubs, 7), // last card taken
        );

        expect(() => playerState.throwCardToDiscardPile(new Card(Suit.Clubs, 8)))
            .not.toThrow();
    });

    it('delegates the TeamGamingArea for the creation of a run', () => {
        const playerCards = [
            new Card(Suit.Clubs, 7),
            new Card(Suit.Clubs, 9),
            new Card(Suit.Clubs, 8),
        ];

        const fakeRun = SequenceRun.restore(playerCards, -1);

        const mockedGamingArea = mock(ConcreteTeamGamingArea);
        when(mockedGamingArea.createRun(playerCards)).thenReturn(fakeRun);

        const playerState = new PlayingPlayerState(
            playerCards,
            instance(mockedGamingArea)
        );

        const run = playerState.createRun(playerCards);
        expect(run).toEqual(fakeRun);
    });

});
