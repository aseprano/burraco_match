import { ConcreteStock } from "./ConcreteStock";
import { Card, Suit } from "../../value_objects/Card";
import { InsufficientCardsInStockException } from "../../exceptions/InsufficientCardsInStockException";

describe("ConcreteStock", () => {
    const deuceOfClubs = new Card(Suit.Clubs, 2);
    const threeOfClubs = new Card(Suit.Clubs, 3);
    const joker = Card.Joker();

    it("can be initialized", () => {
        const stockCards = [deuceOfClubs, threeOfClubs, joker];

        const stock = new ConcreteStock();
        stock.initialize(stockCards);
        expect(stock.getCards()).toEqual(stockCards);
        expect(stock.isEmpty()).toBeFalse();
    });

    it('can be used to pick one card when non empty', () => {
        const stock = new ConcreteStock();

        stock.initialize([deuceOfClubs, threeOfClubs]);

        const card = stock.pickOne();
        expect(card).toEqual(deuceOfClubs);
        expect(stock.isEmpty()).toBeFalse();
    });

    it('throws an exception when trying to pick one card and is empty', () => {
        const emptyStock = new ConcreteStock();
        expect(() => emptyStock.pickOne()).toThrow(new InsufficientCardsInStockException());
    });

    it('throws an exception when trying to pick too many cards', () => {
        const stock = new ConcreteStock();
        stock.initialize([deuceOfClubs, threeOfClubs]);
        expect(() => stock.pick(3)).toThrow(new InsufficientCardsInStockException());
    });

});
