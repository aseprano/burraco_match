import { ConcreteTeamGamingArea } from "./ConcreteTeamGamingArea";
import { ConcreteRunFactory } from "../../factories/impl/ConcreteRunFactory";
import { StdCardSerializer } from "../../domain-services/impl/StdCardSerializer";
import { PlayingPlayerState } from "./PlayingPlayerState";
import { Card, Suit } from "../../value_objects/Card";
import { CardNotOwnedException } from "../../exceptions/CardNotOwnedException";
import { CannotDiscardCardException } from "../../exceptions/CannotDiscardCardException";
import { TeamGamingArea } from "../TeamGamingArea";
import { ActionNotAllowedException } from "../../exceptions/ActionNotAllowedException";

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
        const gamingArea = buildGamingArea();

        const playerState = new PlayingPlayerState([
            new Card(Suit.Clubs, 7)
        ], gamingArea);

        const runCards = [
            new Card(Suit.Clubs, 7),
            new Card(Suit.Clubs, 8)
        ];

        expect(() => playerState.createRun(runCards)).toThrow(new CardNotOwnedException());
    });

    it('does not allow to create a run with a trick', () => {
        const gamingArea = buildGamingArea();

        const playerState = new PlayingPlayerState([
            new Card(Suit.Clubs, 7)
        ], gamingArea);

        const runCards = [
            new Card(Suit.Clubs, 7),
            new Card(Suit.Clubs, 7),
            new Card(Suit.Clubs, 7),
        ];

        expect(() => playerState.createRun(runCards)).toThrow(new CardNotOwnedException());
    });

    it('does not allow to discard the last card taken', () => {
        const gamingArea = buildGamingArea();

        const playerState = new PlayingPlayerState(
            [
                new Card(Suit.Clubs, 7),
                new Card(Suit.Clubs, 8),
                new Card(Suit.Clubs, 9),
            ],
            gamingArea,
            new Card(Suit.Clubs, 8)
        );

        expect(() => playerState.discard(new Card(Suit.Clubs, 8))).toThrow(new CannotDiscardCardException());
    });

    it('does not allow to discard a card not in the hand', () => {
        const gamingArea = buildGamingArea();

        const playerState = new PlayingPlayerState([
            new Card(Suit.Clubs, 7)
        ], gamingArea);

        expect(() => playerState.discard(new Card(Suit.Clubs, 8))).toThrow(new CardNotOwnedException());
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

        expect(() => playerState.discard(new Card(Suit.Clubs, 7))).not.toThrow();
    });

});
