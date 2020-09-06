import { Stock } from '../Stock';
import { StdCardSerializer } from '../../domain-services/impl/StdCardSerializer';
import { ConcretePlayer } from './ConcretePlayer';
import { CardsDealtToPlayer } from "../../events/CardsDealtToPlayer";
import { Card, Suit, CardList } from "../../value_objects/Card";
import { TeamGamingArea } from "../TeamGamingArea";
import { RunCreated } from "../../events/RunCreated";
import { mock, when, instance } from 'ts-mockito';
import { GroupRun } from "./GroupRun";
import { RunID } from "../../value_objects/RunID";
import { PlayerTookOneCardFromStock } from "../../events/PlayerTookOneCardFromStock";
import { PlayerID } from "../../value_objects/PlayerID";
import { PlayerPickedUpDiscardPile } from "../../events/PlayerPickedUpDiscardPile";
import { IdlePlayerState } from "./IdlePlayerState";
import { GameTurnToPlayer } from "../../events/GameTurnToPlayer";
import { ReadyPlayerState } from "./ReadyPlayerState";
import { PlayingPlayerState } from "./PlayingPlayerState";

describe('ConcretePlayer', () => {
    const serializer = new StdCardSerializer();
    const deuceOfClubs = new Card(Suit.Clubs, 2);
    const threeOfClubs = new Card(Suit.Clubs, 3);
    const fourOfClubs = new Card(Suit.Clubs, 4);
    const joker = Card.Joker();

    it('can be initialized via constructor', () => {
        const stock: Stock = <Stock>{};
        const discardPile: CardList = [];

        const player = new ConcretePlayer('darkbyte', serializer, stock, discardPile, {} as TeamGamingArea);
        expect(player.getId()).toEqual('darkbyte');
        expect(player.getHand()).toEqual([], 'A player hand must be empty after initialization');
    });

    it('starts in Idle state', () => {
        const player = new ConcretePlayer('darkbyte', serializer, {} as Stock, [], {} as TeamGamingArea);
        expect(player.getState()).toBeInstanceOf(IdlePlayerState);
    });

    it('adds cards to the hand on CardsDealtToPlayer event', () => {
        const stock: Stock = <Stock>{};
        const discardPile: CardList = [];

        const player = new ConcretePlayer('darkbyte', serializer, stock, discardPile, {} as TeamGamingArea);

        player.applyEvent(new CardsDealtToPlayer(123, [deuceOfClubs, threeOfClubs], 'darkbyte')); // should be applied
        player.applyEvent(new CardsDealtToPlayer(123, [deuceOfClubs, joker], 'darkbyte')); // should be applied
        player.applyEvent(new CardsDealtToPlayer(123, [fourOfClubs], 'john')); // should be discarded

        expect(player.getHand()).toEqual([deuceOfClubs, threeOfClubs, deuceOfClubs, joker]);
    });

    it('switches to the Ready state on turn', () => {
        const player = new ConcretePlayer('darkbyte', serializer, {} as Stock, [], {} as TeamGamingArea);

        player.applyEvent(new GameTurnToPlayer(123, 'darkbyte'));
        expect(player.getState()).toBeInstanceOf(ReadyPlayerState);
    });

    it('adds cards to the hand on PlayerTookOneCardFromStock event', () => {
        const player = new ConcretePlayer('darkbyte', serializer, {} as Stock, [], {} as TeamGamingArea);
        player.applyEvent(new PlayerTookOneCardFromStock(123, new PlayerID('darkbyte'), new Card(Suit.Diamonds, 9)));

        expect(player.getHand()).toEqual([
            new Card(Suit.Diamonds, 9),
        ]);
    });

    it('adds cards to the hand on PlayerPickedUpDiscardPile event', () => {
        const player = new ConcretePlayer('darkbyte', serializer, {} as Stock, [], {} as TeamGamingArea);

        player.applyEvent(
            new PlayerPickedUpDiscardPile(
                123,
                new PlayerID('darkbyte'),
                [
                    new Card(Suit.Diamonds, 9),
                    new Card(Suit.Hearts, 11),
                    new Card(Suit.Clubs, 2),
                ]
            )
        );

        expect(player.getHand()).toEqual([
            new Card(Suit.Diamonds, 9),
            new Card(Suit.Hearts, 11),
            new Card(Suit.Clubs, 2),
        ]);
    });

    it('switches to the Playing state after picking from the stock', () => {
        const player = new ConcretePlayer('darkbyte', serializer, {} as Stock, [], {} as TeamGamingArea);
        player.applyEvent(new PlayerTookOneCardFromStock(123, new PlayerID('darkbyte'), new Card(Suit.Diamonds, 9)));

        expect(player.getState()).toBeInstanceOf(PlayingPlayerState);
    });

    it('switches to the Playing state after picking up the discard pile', () => {
        const player = new ConcretePlayer('darkbyte', serializer, {} as Stock, [], {} as TeamGamingArea);
        player.applyEvent(new PlayerPickedUpDiscardPile(123, new PlayerID('darkbyte'), []));
        expect(player.getState()).toBeInstanceOf(PlayingPlayerState);
    });

    it('removes cards from hand when applying the RunCreated event', () => {
        const player = new ConcretePlayer('darkbyte', serializer, {} as Stock, [], {} as TeamGamingArea);

        const playerCards = [
            deuceOfClubs,
            threeOfClubs,
            fourOfClubs,
            joker
        ];

        player.applyEvent(new CardsDealtToPlayer(123, playerCards, 'darkbyte'));

        const runCards = [
            fourOfClubs,
            threeOfClubs
        ];

        const fakeRun = mock(GroupRun);
        when(fakeRun.getId()).thenReturn(new RunID(1));
        when(fakeRun.getCards()).thenReturn(runCards);
        when(fakeRun.getWildcardPosition()).thenReturn(-1);
        when(fakeRun.isSequence()).thenReturn(true);

        player.applyEvent(new RunCreated(123, 'darkbyte', 0, instance(fakeRun)));

        expect(player.getHand()).toEqual([
            deuceOfClubs,
            joker,
        ]);
    });

});
