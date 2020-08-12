import { Stock } from '../Stock';
import { DiscardPile } from '../DiscardPile';
import { StdCardSerializer } from '../../domain-services/impl/StdCardSerializer';
import { ConcretePlayer } from './ConcretePlayer';
import { CardsDealtToPlayer } from "../../events/CardsDealtToPlayer";
import { Card, Suit } from "../../value_objects/Card";

describe('ConcretePlayer', () => {
    const serializer = new StdCardSerializer();
    const deuceOfClubs = new Card(Suit.Clubs, 2);
    const threeOfClubs = new Card(Suit.Clubs, 3);
    const fourOfClubs = new Card(Suit.Clubs, 4);
    const joker = Card.Joker();

    it('can be initialized via constructor', () => {
        const stock: Stock = <Stock>{};
        const discardPile: DiscardPile = <DiscardPile>{};

        const player = new ConcretePlayer('darkbyte', serializer, stock, discardPile);
        expect(player.getId()).toEqual('darkbyte');
        expect(player.getHand()).toEqual([], 'A player hand must be empty after initialization');
    });

    it('\'s hand is built from event', () => {
        const stock: Stock = <Stock>{};
        const discardPile: DiscardPile = <DiscardPile>{};

        const player = new ConcretePlayer('darkbyte', serializer, stock, discardPile);

        player.applyEvent(new CardsDealtToPlayer(123, [deuceOfClubs, threeOfClubs], 'darkbyte')); // should be applied
        player.applyEvent(new CardsDealtToPlayer(123, [deuceOfClubs, joker], 'darkbyte')); // should be applied
        player.applyEvent(new CardsDealtToPlayer(123, [fourOfClubs], 'john')); // should be discarded

        expect(player.getHand()).toEqual([deuceOfClubs, threeOfClubs, deuceOfClubs, joker]);
    });

})