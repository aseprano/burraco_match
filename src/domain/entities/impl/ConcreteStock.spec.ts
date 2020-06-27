import { ConcreteStock } from "./ConcreteStock";
import { Card, Suit } from "../../value_objects/Card";
import { StockInitialized } from "../../events/StockInitialized";
import { CardPickedFromStock } from "../../events/CardPickedFromStock";
import { StockIsEmptyException } from "../../exceptions/StockIsEmptyException";
import { StdCardSerializer } from "../../domain-services/impl/StdCardSerializer";

describe("ConcreteStock", () => {
    const cardSerializer = new StdCardSerializer();
    const deuceOfClubs = new Card(Suit.Clubs, 2);
    const threeOfClubs = new Card(Suit.Clubs, 3);
    const joker = Card.Joker();

    it("can be initialized with an id and a list of cards", () => {
        const stockId = 10;
        const matchId = 123;
        const stockCards = [deuceOfClubs, threeOfClubs, joker];

        const stock = new ConcreteStock(cardSerializer);
        stock.initialize(stockId, matchId, stockCards)
        ;
        expect(stock.getId()).toEqual(stockId);
        expect(stock.getCards()).toEqual(stockCards);
        expect(stock.isEmpty()).toBeFalse();

        expect(stock.commitEvents()).toEqual([
            new StockInitialized(stockId, matchId, stockCards),
        ]);
    });

    it('can be used to pick one card when non empty', () => {
        const stock = new ConcreteStock(cardSerializer);

        stock.restoreFromEventStream({
            events: [
                new StockInitialized(10, 123, [deuceOfClubs, threeOfClubs]),
            ],
            version: 1
        });

        const card = stock.pickOneCard();
        expect(card).toEqual(deuceOfClubs);
        expect(stock.isEmpty()).toBeFalse();
        expect(stock.getCards()).toEqual([threeOfClubs]);
        expect(stock.commitEvents()).toEqual([
            new CardPickedFromStock(10, deuceOfClubs),
        ]);
    });

    it('throws an exception when trying to pick one card and is empty', () => {
        const emptyStock = new ConcreteStock(cardSerializer);
        expect(() => emptyStock.pickOneCard()).toThrow(new StockIsEmptyException());
    });

    it('can be restored from events', () => {
        const stock = new ConcreteStock(cardSerializer);
        
        stock.restoreFromEventStream({
            events: [
                new StockInitialized(7, 123, [ deuceOfClubs, threeOfClubs, joker ]),
                new CardPickedFromStock(7, deuceOfClubs),
            ],
            version: 2
        });

        expect(stock.getCards()).toEqual([ threeOfClubs, joker ]);
        expect(stock.getId()).toEqual(7);
        expect(stock.getVersion()).toEqual(2);
        expect(stock.commitEvents()).toEqual([]);
    });

    it('can build a snapshot', () => {
        const stock = new ConcreteStock(cardSerializer);

        stock.restoreFromEventStream({
            events: [
                new StockInitialized(100, 100, [deuceOfClubs, threeOfClubs, joker]),
            ],
            version: 1
        });

        const snapshot = stock.getSnapshot();

        expect(snapshot.state).toEqual({
            entityId: 100,
            cards: [
                { suit: Suit.Clubs, value: 2 },
                { suit: Suit.Clubs, value: 3 },
                { suit: Suit.Joker, value: 0 },
            ],
        });
    });

    it('can be restored from snapshot', () => {
        const stock = new ConcreteStock(cardSerializer);

        stock.restoreFromEventStream({
            events: [],
            version: 1
        }, {
            version: 1,
            state: {
                entityId: 100,
                cards: [
                    { suit: Suit.Clubs, value: 2 },
                    { suit: Suit.Clubs, value: 3 },
                    { suit: Suit.Joker, value: 0 }
                ]
            }
        });

        expect(stock.getVersion()).toEqual(1);
        expect(stock.getId()).toEqual(100);
        expect(stock.getCards()).toEqual([
            deuceOfClubs,
            threeOfClubs,
            joker
        ]);
    });

});
