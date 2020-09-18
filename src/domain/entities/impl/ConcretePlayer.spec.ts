import { Stock } from '../Stock';
import { StdCardSerializer } from '../../domain-services/impl/StdCardSerializer';
import { ConcretePlayer } from './ConcretePlayer';
import { CardsDealtToPlayer } from "../../events/CardsDealtToPlayer";
import { Card, Suit } from "../../value_objects/Card";
import { CardList } from "../../value_objects/CardList";
import { TeamGamingArea } from "../TeamGamingArea";
import { RunCreated } from "../../events/RunCreated";
import { CardsMeldedToRun } from "../../events/CardsMeldedToRun";
import { mock, when, instance } from 'ts-mockito';
import { GroupRun } from "./GroupRun";
import { SequenceRun } from "./SequenceRun";
import { RunID } from "../../value_objects/RunID";
import { PlayerTookOneCardFromStock } from "../../events/PlayerTookOneCardFromStock";
import { PlayerPickedUpDiscardPile } from "../../events/PlayerPickedUpDiscardPile";
import { IdlePlayerState } from "./IdlePlayerState";
import { GameTurnToPlayer } from "../../events/GameTurnToPlayer";
import { ReadyPlayerState } from "./ReadyPlayerState";
import { PlayingPlayerState } from "./PlayingPlayerState";
import { PlayerThrewCardToDiscardPile } from "../../events/PlayerThrewCardToDiscardPile";
import { PlayerTookPot } from "../../events/PlayerTookPot";

describe('ConcretePlayer', () => {
    const serializer = new StdCardSerializer();
    const deuceOfClubs = new Card(Suit.Clubs, 2);
    const threeOfClubs = new Card(Suit.Clubs, 3);
    const fourOfClubs = new Card(Suit.Clubs, 4);
    const joker = Card.Joker();

    it('can be initialized via constructor', () => {
        const stock: Stock = <Stock>{};
        const discardPile = new CardList();

        const player = new ConcretePlayer('darkbyte', 'joe', serializer, stock, discardPile, {} as TeamGamingArea);
        expect(player.getId()).toEqual('darkbyte');
        expect(player.getHand().cards).toEqual([], 'A player hand must be empty after initialization');
    });

    it('starts in Idle state', () => {
        const player = new ConcretePlayer('darkbyte', '', serializer, {} as Stock, new CardList(), {} as TeamGamingArea);
        expect(player.getState()).toBeInstanceOf(IdlePlayerState);
    });

    it('adds cards to the hand on CardsDealtToPlayer event', () => {
        const stock: Stock = <Stock>{};
        const discardPile = new CardList();

        const player = new ConcretePlayer('darkbyte', '', serializer, stock, discardPile, {} as TeamGamingArea);

        player.applyEvent(new CardsDealtToPlayer(123, new CardList([deuceOfClubs, threeOfClubs]), 'darkbyte')); // should be applied
        player.applyEvent(new CardsDealtToPlayer(123, new CardList([deuceOfClubs, joker]), 'darkbyte')); // should be applied
        player.applyEvent(new CardsDealtToPlayer(123, new CardList([fourOfClubs]), 'john')); // should be discarded

        expect(player.getHand().cards).toEqual([deuceOfClubs, threeOfClubs, deuceOfClubs, joker]);
    });

    it('switches to the Ready state on turn', () => {
        const player = new ConcretePlayer('darkbyte', '', serializer, {} as Stock, new CardList(), {} as TeamGamingArea);

        player.applyEvent(new GameTurnToPlayer(123, 'darkbyte'));
        expect(player.getState()).toBeInstanceOf(ReadyPlayerState);
    });

    it('adds cards to the hand on PlayerTookOneCardFromStock event', () => {
        const player = new ConcretePlayer('darkbyte', '', serializer, {} as Stock, new CardList(), {} as TeamGamingArea);
        player.applyEvent(new PlayerTookOneCardFromStock(123, 'darkbyte', new Card(Suit.Diamonds, 9)));

        expect(player.getHand().cards).toEqual([
            new Card(Suit.Diamonds, 9),
        ]);
    });

    it('adds cards to the hand on PlayerPickedUpDiscardPile event', () => {
        const player = new ConcretePlayer('darkbyte', '', serializer, {} as Stock, new CardList(), {} as TeamGamingArea);

        player.applyEvent(
            new PlayerPickedUpDiscardPile(
                123,
                'darkbyte',
                new CardList([
                    new Card(Suit.Diamonds, 9),
                    new Card(Suit.Hearts, 11),
                    new Card(Suit.Clubs, 2),
                ])
            )
        );

        expect(player.getHand().cards).toEqual([
            new Card(Suit.Diamonds, 9),
            new Card(Suit.Hearts, 11),
            new Card(Suit.Clubs, 2),
        ]);
    });

    it('switches to the Playing state after picking from the stock', () => {
        const player = new ConcretePlayer('darkbyte', '', serializer, {} as Stock, new CardList(), {} as TeamGamingArea);
        player.applyEvent(new PlayerTookOneCardFromStock(123, 'darkbyte', new Card(Suit.Diamonds, 9)));

        expect(player.getState()).toBeInstanceOf(PlayingPlayerState);
    });

    it('switches to the Playing state after picking up the discard pile', () => {
        const player = new ConcretePlayer('darkbyte', '', serializer, {} as Stock, new CardList(), {} as TeamGamingArea);
        player.applyEvent(new PlayerPickedUpDiscardPile(123, 'darkbyte', CardList.empty()));
        expect(player.getState()).toBeInstanceOf(PlayingPlayerState);
    });

    it('switches to the Playing state after creating a run', () => {
        const player = new ConcretePlayer(
            'darkbyte',
            '',
            serializer,
            {} as Stock,
            new CardList(),
            {} as TeamGamingArea,
        );

        player.setLastCardTaken(new Card(Suit.Clubs, 9));
        player.setHand(new CardList([
            new Card(Suit.Clubs, 9),
            new Card(Suit.Clubs, 10),
            new Card(Suit.Clubs, 11),
            new Card(Suit.Clubs, 12),
            new Card(Suit.Clubs, 13),
        ]));

        player.applyEvent(new RunCreated(
            123,
            'darkbyte',
            0,
            SequenceRun.restore(
                [
                    new Card(Suit.Clubs, 9),
                    new Card(Suit.Clubs, 10),
                    new Card(Suit.Clubs, 11),
                ],
                -1
            )
        ));

        expect(player.getState()).toBeInstanceOf(PlayingPlayerState);
        
        const state = player.getState() as PlayingPlayerState;

        expect(state.hand).toEqual(new CardList([
            new Card(Suit.Clubs, 12),
            new Card(Suit.Clubs, 13),
        ]));

        expect(state.lastCardTakenFromDiscardPile).toEqual(new Card(Suit.Clubs, 9));
    });

    it('removes cards from hand when applying the RunCreated event', () => {
        const player = new ConcretePlayer('darkbyte', '', serializer, {} as Stock, new CardList(), {} as TeamGamingArea);

        const playerCards = [
            deuceOfClubs,
            threeOfClubs,
            fourOfClubs,
            joker
        ];

        player.applyEvent(new CardsDealtToPlayer(123, new CardList(playerCards), 'darkbyte'));

        const runCards = [
            fourOfClubs,
            threeOfClubs
        ];

        const fakeRun = mock(GroupRun);
        when(fakeRun.getId()).thenReturn(new RunID(1));
        when(fakeRun.getCards()).thenReturn(new CardList(runCards));
        when(fakeRun.getWildcardPosition()).thenReturn(-1);
        when(fakeRun.isSequence()).thenReturn(true);

        player.applyEvent(new RunCreated(123, 'darkbyte', 0, instance(fakeRun)));

        expect(player.getHand().cards).toEqual([
            deuceOfClubs,
            joker,
        ]);
    });

    it('removes cards from hand when applying the CardsMeldedToRun event', () => {
        const player = new ConcretePlayer('darkbyte', '', serializer, {} as Stock, new CardList(), {} as TeamGamingArea);

        const playerCards = [
            deuceOfClubs,
            threeOfClubs,
            fourOfClubs,
            joker
        ];

        player.applyEvent(new CardsDealtToPlayer(123, new CardList(playerCards), 'darkbyte'));

        const runCards = [
            fourOfClubs,
            threeOfClubs
        ];

        const fakeRun = mock(GroupRun);
        when(fakeRun.getId()).thenReturn(new RunID(1));
        when(fakeRun.getCards()).thenReturn(new CardList(runCards));
        when(fakeRun.getWildcardPosition()).thenReturn(-1);
        when(fakeRun.isSequence()).thenReturn(true);

        player.applyEvent(new CardsMeldedToRun(
            123,
            'darkbyte',
            1,
            new CardList(runCards),
            SequenceRun.restore(new CardList(runCards), -1)
        ));

        expect(player.getHand().cards).toEqual([
            deuceOfClubs,
            joker,
        ]);
    });

    it('removes cards from hand when applying the PlayerThrewCardToDiscardPile event', () => {
        const player = new ConcretePlayer('darkbyte', '', serializer, {} as Stock, new CardList(), {} as TeamGamingArea);

        const playerCards = [
            deuceOfClubs,
            threeOfClubs,
            fourOfClubs,
            joker
        ];

        player.applyEvent(new CardsDealtToPlayer(123, new CardList(playerCards), 'darkbyte'));

        player.applyEvent(new PlayerThrewCardToDiscardPile(
            123,
            'darkbyte',
            threeOfClubs
        ));

        expect(player.getHand().cards).toEqual([
            deuceOfClubs,
            fourOfClubs,
            joker,
        ]);
    });
    
    it('switches to Idle state after throwning a card', () => {
        const player = new ConcretePlayer('darkbyte', '', serializer, {} as Stock, new CardList(), {} as TeamGamingArea);
        player.applyEvent(new PlayerThrewCardToDiscardPile(123, 'darkbyte', Card.Joker()));
        expect(player.getState()).toBeInstanceOf(IdlePlayerState);
    });

    it('adds cards to the hand and marks the pot taken flag when the pot has been taken by the player itself', () => {
        const player = new ConcretePlayer(
            'darkbyte',
            '',
            serializer,
            {} as Stock,
            new CardList(),
            {} as TeamGamingArea
        );

        player.setHand(new CardList([
            new Card(Suit.Clubs, 8),
        ]));

        player.applyEvent(
            new PlayerTookPot(
                123,
                'darkbyte',
                new CardList([
                    new Card(Suit.Diamonds, 7),
                    new Card(Suit.Hearts, 13),
                ]),
            ),
        );

        expect(player.getPotTaken()).toBeTrue();

        expect(player.getHand().asArray())
            .toEqual([
                new Card(Suit.Clubs, 8),
                new Card(Suit.Diamonds, 7),
                new Card(Suit.Hearts, 13),
            ]);
    });

    it('just marks the pot taken flag when the pot has been taken by the teammate', () => {
        const player = new ConcretePlayer(
            'darkbyte',
            'john',
            serializer,
            {} as Stock,
            new CardList(),
            {} as TeamGamingArea
        );

        player.setHand(new CardList([
            new Card(Suit.Clubs, 8),
        ]));

        player.applyEvent(
            new PlayerTookPot(
                123,
                'john',
                new CardList([
                    new Card(Suit.Diamonds, 7),
                    new Card(Suit.Hearts, 13),
                ]),
            ),
        );

        expect(player.getPotTaken()).toBeTrue();

        expect(player.getHand().asArray())
            .toEqual([
                new Card(Suit.Clubs, 8),
            ]);
    });

    it('ignores the PlayerTookPot that does not belong to the team', () => {
        const player = new ConcretePlayer(
            'darkbyte',
            'john',
            serializer,
            {} as Stock,
            new CardList(),
            {} as TeamGamingArea
        );

        player.setHand(new CardList([
            new Card(Suit.Clubs, 8),
        ]));

        player.applyEvent(
            new PlayerTookPot(
                123,
                'jonsnow',
                new CardList([
                    new Card(Suit.Diamonds, 7),
                    new Card(Suit.Hearts, 13),
                ]),
            ),
        );

        expect(player.getPotTaken()).toBeFalse();

        expect(player.getHand().asArray())
            .toEqual([
                new Card(Suit.Clubs, 8),
            ]);
    });

    it('does not switch to the Playing state in case of PlayerTookPot event following the PlayerThrewCarfdToDiscardPile event', () => {
        const player = new ConcretePlayer(
            'darkbyte',
            'john',
            serializer,
            {} as Stock,
            new CardList(),
            {} as TeamGamingArea
        );

        player.setHand(new CardList([
            new Card(Suit.Clubs, 8),
        ]));

        player.applyEvent(new PlayerThrewCardToDiscardPile(
            123,
            'darkbyte',
            new Card(Suit.Clubs, 8)
        ));

        player.applyEvent(
            new PlayerTookPot(
                123,
                'darkbyte',
                new CardList([
                    new Card(Suit.Diamonds, 7),
                    new Card(Suit.Hearts, 13),
                ]),
            ),
        );

        expect(player.getPotTaken()).toBeTrue();

        expect(player.getState()).toBeInstanceOf(IdlePlayerState);

    });

});
