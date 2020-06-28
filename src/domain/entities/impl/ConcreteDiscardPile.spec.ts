import { ConcreteDiscardPile } from "./ConcreteDiscardPile";
import { DiscardPileInitialized } from "../../events/DiscardPileInitialized";
import { Card, Suit } from "../../value_objects/Card";
import { CardThrownToDiscardPile } from "../../events/CardThrownToDiscardPile";
import { CardsPickedFromDiscardPile } from "../../events/CardsPickedFromDiscardPile";
import { StdCardSerializer } from "../../domain-services/impl/StdCardSerializer";

describe('ConcreteDiscardPile', () => {
    const cardSerializer = new StdCardSerializer();
    const deuceOfClubs = new Card(Suit.Clubs, 2);
    const threeOfClubs = new Card(Suit.Clubs, 3);
    const fourOfClubs = new Card(Suit.Clubs, 4);
    const fiveOfClubs = new Card(Suit.Clubs, 5);

    it('is initalized properly', () => {
        const discardPile = new ConcreteDiscardPile(cardSerializer);
        discardPile.initalize(100, 42);

        expect(discardPile.getId()).toEqual(100);

        expect(discardPile.commitEvents()).toEqual([
            new DiscardPileInitialized(100, 42),
        ]);
    });

    it('can be thrown a card on top', () => {
        const discardPileId = 100;
        const tenOfClubs = new Card(Suit.Clubs, 10);
        
        const discardPile = new ConcreteDiscardPile(cardSerializer);
        discardPile.restoreFromEventStream({
            events: [
                new DiscardPileInitialized(discardPileId, 42),
            ],
            version: 1
        });

        discardPile.throwCard(tenOfClubs);

        expect(discardPile.getCards()).toEqual([ tenOfClubs ]);

        expect(discardPile.commitEvents()).toEqual([
            new CardThrownToDiscardPile(discardPileId, tenOfClubs),
        ]);
    });

    it('can take all cards', () => {
        const discardPile = new ConcreteDiscardPile(cardSerializer);
        const discardPileId = 100;

        discardPile.restoreFromEventStream({
            events: [
                new DiscardPileInitialized(discardPileId, 101),
                new CardThrownToDiscardPile(discardPileId, deuceOfClubs),
                new CardsPickedFromDiscardPile(discardPileId, [deuceOfClubs]),
                new CardThrownToDiscardPile(discardPileId, threeOfClubs),
                new CardThrownToDiscardPile(discardPileId, fourOfClubs),
                new CardThrownToDiscardPile(discardPileId, fiveOfClubs),
            ],
            version: 6
        });

        const cards = discardPile.takeAll();
        
        expect(cards).toEqual([
            threeOfClubs,
            fourOfClubs,
            fiveOfClubs
        ]);

        expect(discardPile.commitEvents()).toEqual([
            new CardsPickedFromDiscardPile(discardPileId, cards),
        ]);
    });

    it('can be restored from events', () => {
        const discardPile = new ConcreteDiscardPile(cardSerializer);
        const discardPileId = 100;

        discardPile.restoreFromEventStream({
            events: [
                new DiscardPileInitialized(discardPileId, 101),
                new CardThrownToDiscardPile(discardPileId, deuceOfClubs),
                new CardsPickedFromDiscardPile(discardPileId, [deuceOfClubs]),
                new CardThrownToDiscardPile(discardPileId, threeOfClubs),
                new CardThrownToDiscardPile(discardPileId, fourOfClubs),
                new CardThrownToDiscardPile(discardPileId, fiveOfClubs),
            ],
            version: 6
        });

        expect(discardPile.getVersion()).toEqual(6);
        expect(discardPile.getId()).toEqual(discardPileId);
        expect(discardPile.getCards()).toEqual([
            threeOfClubs,
            fourOfClubs,
            fiveOfClubs
        ]);
    });

    it('can be snapshotted', () => {
        const discardPile = new ConcreteDiscardPile(cardSerializer);

        discardPile.restoreFromEventStream({
            events: [
                new DiscardPileInitialized(1, 20),
                new CardThrownToDiscardPile(1, deuceOfClubs),
                new CardThrownToDiscardPile(1, threeOfClubs),
            ],
            version: 1,
        });

        const snapshot = discardPile.getSnapshot();

        expect(snapshot).toEqual({
            state: {
                entityId: 1,
                cards: [
                    { suit: Suit.Clubs, value: 2 },
                    { suit: Suit.Clubs, value: 3 },
                ],
            },
            version: 1
        });

    });

    it('can be restored from snapshot', () => {
        const discardPile = new ConcreteDiscardPile(cardSerializer);

        discardPile.restoreFromEventStream({
            events: [
                new CardThrownToDiscardPile(1, threeOfClubs),
                new CardThrownToDiscardPile(1, deuceOfClubs),
            ],
            version: 5,
        }, {
            state: {
                entityId: 1,
                cards: [
                    { suit: Suit.Clubs, value: 2 },
                ]
            },
            version: 3,
        });

        expect(discardPile.getId()).toEqual(1);
        expect(discardPile.getVersion()).toEqual(5);
        expect(discardPile.getCards()).toEqual([
            deuceOfClubs,
            threeOfClubs,
            deuceOfClubs,
        ]);
    });

});
