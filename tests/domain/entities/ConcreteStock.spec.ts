import { ConcreteStock } from "../../../src/domain/entities/impl/ConcreteStock";
import { Card, Suit } from "../../../src/domain/value_objects/Card";
import { CardList } from "../../../src/domain/value_objects/CardList";
import { InsufficientCardsInStockException } from "../../../src/domain/exceptions/InsufficientCardsInStockException";
import { StdCardSerializer } from "../../../src/domain/domain-services/impl/StdCardSerializer";
import { MatchStarted } from "../../../src/domain/events/MatchStarted";
import { CardsShuffler } from "../../../src/domain/domain-services/CardsShuffler";
import { CardsDealtToPlayer } from "../../../src/domain/events/CardsDealtToPlayer";
import { PotCreated } from "../../../src/domain/events/PotCreated";
import { FirstCardThrown } from "../../../src/domain/events/FirstCardThrown";

describe("ConcreteStock", () => {
    const deuceOfClubs = new Card(Suit.Clubs, 2);
    const threeOfClubs = new Card(Suit.Clubs, 3);
    const joker = Card.Joker();
    const serializer = new StdCardSerializer();

    it("can be initialized from MatchStarted event", () => {
        const stock = new ConcreteStock(serializer);

        const stockCards = new CardList([deuceOfClubs, threeOfClubs, joker]);
        stock.applyEvent(new MatchStarted(1, 1, stockCards, [], []));

        expect(stock.getCards().isEqual(stockCards)).toBeTrue();
    });

    it('can be used to pick one card when non empty', () => {
        const stockCards = new CardList([deuceOfClubs, threeOfClubs, joker]);
        const stock = new ConcreteStock(serializer);
        stock.applyEvent(new MatchStarted(1, 1, stockCards, [], []));

        const card = stock.takeOne();
        expect(card).toEqual(deuceOfClubs);
        expect(stock.getCards().length).toBe(3, 'Cards must not be removed from stock when picked');
    });

    it('can be used to pick more than one card', () => {
        const stockCards = new CardList([deuceOfClubs, threeOfClubs, joker]);
        const stock = new ConcreteStock(serializer);
        stock.applyEvent(new MatchStarted(1, 1, stockCards, [], []));

        const cards = stock.take(2);
        expect(cards.asArray()).toEqual([deuceOfClubs, threeOfClubs]);
        expect(stock.getCards().length).toBe(3, 'Cards must not be removed from stock when picked');
    });

    it('throws an exception when trying to pick one card and is empty', () => {
        const emptyStock = new ConcreteStock(serializer);
        expect(() => emptyStock.takeOne()).toThrow(new InsufficientCardsInStockException());
    });

    it('throws an exception when trying to pick too many cards', () => {
        const stockCards = new CardList([deuceOfClubs, threeOfClubs, joker]);
        const stock = new ConcreteStock(serializer);
        stock.applyEvent(new MatchStarted(1, 1, stockCards, [], []));

        expect(() => stock.take(4)).toThrow(new InsufficientCardsInStockException());
    });

    it('can be rebuilt and shuffled', () => {
        // ensure that the rebuilt stock has 108 cards (52 * 2, plus 2 jokers)
        // and that no card is missing
        // and that they are shuffled (???)
        const stock = new ConcreteStock(serializer);
        stock.shuffle();

        // ensuring the stock contains 108 cards
        expect(stock.getCards().length).toBe(108, 'A stock must be made of 108 cards');

        const pairs: {
            [key: string]: number
        } = {};

        // counting how many times each card appears
        stock.getCards().cards.map((card) => card.isJoker() ? 'JOKER' : JSON.stringify(serializer.serializeCard(card)))
            .forEach((strCard) => {
                pairs[strCard] = (pairs[strCard] || 0) + 1;
            });
        
        expect(Object.keys(pairs).length).toBe(53, 'Some cards are missing from the stock');

        Object.keys(pairs).filter((key) => key !== 'JOKER')
            .forEach((key) => expect(pairs[key]).toBe(2, 'Some cards are not paired in the stock'));

        expect(pairs['JOKER']).toEqual(4, 'There must be 4 jokers in the stock');

        // checking cards are not sequencial
        let numberOfSequencialCards = 0;
        let previousCard: Card;

        stock.getCards().cards.forEach((card) => {
            if (previousCard && previousCard.getSuit() === card.getSuit() && Math.abs(previousCard.getValue() - card.getValue()) === 1) {
                numberOfSequencialCards++;
            }

            previousCard = card;
        });
        
        expect(numberOfSequencialCards).toBeLessThan(11, 'Too many non-sequencial cards: stock is not shuffled');
    });

    it('removes as many cards as dealt to player', () => {
        const cards = [
            deuceOfClubs,
            deuceOfClubs,
            threeOfClubs,
            joker
        ];

        const stock = new ConcreteStock(serializer, (cards) => cards, () => new CardList(cards));
        stock.shuffle();

        stock.applyEvent(new CardsDealtToPlayer(123, new CardList([deuceOfClubs, threeOfClubs]), 'johndoe'));

        expect(stock.getCards().cards).toEqual([deuceOfClubs, joker]);
    });

    it('removes as many cards as used to create the pot', () => {
        const stockCards = [
            deuceOfClubs,
            deuceOfClubs,
            threeOfClubs,
            joker
        ];

        const stock = new ConcreteStock(serializer, cards => cards, () => new CardList(stockCards));
        stock.shuffle();

        stock.applyEvent(new PotCreated(123, new CardList([deuceOfClubs, joker])));

        expect(stock.getCards().cards).toEqual([deuceOfClubs, threeOfClubs]);
    });

    it('removes the first card thrown', () => {
        const stockCards = [
            deuceOfClubs,
            deuceOfClubs,
            threeOfClubs,
            joker
        ];

        const stock = new ConcreteStock(serializer, cards => cards, () => new CardList(stockCards));
        stock.shuffle();

        stock.applyEvent(new FirstCardThrown(8, deuceOfClubs));

        expect(stock.asArray()).toEqual([deuceOfClubs, threeOfClubs, joker]);
    });

    it('uses the injected provider to rebuild the deck', () => {
        const stockCards = new CardList([
            deuceOfClubs,
            threeOfClubs,
            joker
        ]);

        const stock = new ConcreteStock(serializer, CardsShuffler.noShuffling, () => stockCards);
        stock.shuffle();
        
        expect(stock.asArray())
            .toEqual([
                new Card(Suit.Clubs, 2),
                new Card(Suit.Clubs, 3),
                Card.Joker(),
            ]); 
    });

});
