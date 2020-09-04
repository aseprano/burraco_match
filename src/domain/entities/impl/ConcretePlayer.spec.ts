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

    it('\'s hand is built from event', () => {
        const stock: Stock = <Stock>{};
        const discardPile: CardList = [];

        const player = new ConcretePlayer('darkbyte', serializer, stock, discardPile, {} as TeamGamingArea);

        player.applyEvent(new CardsDealtToPlayer(123, [deuceOfClubs, threeOfClubs], 'darkbyte')); // should be applied
        player.applyEvent(new CardsDealtToPlayer(123, [deuceOfClubs, joker], 'darkbyte')); // should be applied
        player.applyEvent(new CardsDealtToPlayer(123, [fourOfClubs], 'john')); // should be discarded

        expect(player.getHand()).toEqual([deuceOfClubs, threeOfClubs, deuceOfClubs, joker]);
    });

    it('removes cards from hand when applying the NewRun event', () => {
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

})