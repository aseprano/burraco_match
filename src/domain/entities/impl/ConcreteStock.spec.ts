import { ConcreteStock } from "./ConcreteStock";
import { Card, Suit } from "../../value_objects/Card";
import { InsufficientCardsInStockException } from "../../exceptions/InsufficientCardsInStockException";
import { StdCardSerializer } from "../../domain-services/impl/StdCardSerializer";
import { MatchStarted } from "../../events/MatchStarted";

describe("ConcreteStock", () => {
    const deuceOfClubs = new Card(Suit.Clubs, 2);
    const threeOfClubs = new Card(Suit.Clubs, 3);
    const joker = Card.Joker();
    const serializer = new StdCardSerializer();

    it("can be initialized from MatchStarted event", () => {
        const stock = new ConcreteStock(serializer);

        const stockCards = [deuceOfClubs, threeOfClubs, joker];
        stock.applyEvent(new MatchStarted(1, 1, stockCards, [], []));

        expect(stock.getCards()).toEqual(stockCards);
        expect(stock.isEmpty()).toBeFalse();
    });

    it('can be used to pick one card when non empty', () => {
        const stockCards = [deuceOfClubs, threeOfClubs, joker];
        const stock = new ConcreteStock(serializer);
        stock.applyEvent(new MatchStarted(1, 1, stockCards, [], []));

        const card = stock.pickOne();
        expect(card).toEqual(deuceOfClubs);
        expect(stock.isEmpty()).toBeFalse();
    });

    it('throws an exception when trying to pick one card and is empty', () => {
        const emptyStock = new ConcreteStock(serializer);
        expect(() => emptyStock.pickOne()).toThrow(new InsufficientCardsInStockException());
    });

    it('throws an exception when trying to pick too many cards', () => {
        const stockCards = [deuceOfClubs, threeOfClubs, joker];
        const stock = new ConcreteStock(serializer);
        stock.applyEvent(new MatchStarted(1, 1, stockCards, [], []));

        expect(() => stock.pick(4)).toThrow(new InsufficientCardsInStockException());
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
        stock.getCards().map((card) => card.isJoker() ? 'JOKER' : JSON.stringify(serializer.serializeCard(card)))
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

        stock.getCards().forEach((card) => {
            if (previousCard && previousCard.getSuit() === card.getSuit() && Math.abs(previousCard.getValue() - card.getValue()) === 1) {
                numberOfSequencialCards++;
            }

            previousCard = card;
        });
        
        expect(numberOfSequencialCards).toBeLessThan(11, 'Too many non-sequencial cards: stock is not shuffled');
    });

});
