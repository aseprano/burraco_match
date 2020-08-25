import { ReadyPlayerState } from './ReadyPlayerState';
import { ConcreteStock  } from './ConcreteStock';
import { Card, Suit, CardList } from "../../value_objects/Card";
import { StdCardSerializer } from "../../domain-services/impl/StdCardSerializer";
import { CardsShuffler } from "../../domain-services/CardsShuffler";
import { Stock } from "../Stock";
import { ActionNotAllowedException } from "../../exceptions/ActionNotAllowedException";
import { RunID } from "../../value_objects/RunID";

function createStock(cards: CardList): Stock {
    const stock = new ConcreteStock(
        new StdCardSerializer(),
        CardsShuffler.noShuffling,
        () => cards
    );

    stock.shuffle();

    return stock;
}

describe('ReadyPlayerState', () => {
    const stockCards = [
        Card.Joker(),
        new Card(Suit.Hearts, 9),
    ];

    const discardPile: CardList = [
        new Card(Suit.Clubs, 2),
        new Card(Suit.Diamonds, 7)
    ];

    const stock = createStock(stockCards);

    const state = new ReadyPlayerState(stock, discardPile);

    it('allows to take one card from the stock', () => {
        const card = state.takeOneCardFromStock();
        expect(card).toEqual(stockCards[0]);
    });

    it('allows to  pick up all cards from the discard pile', () => {
        const cards = state.pickUpAllCardsFromDiscardPile();
        expect(cards).toEqual(discardPile);
    });

    it('does not alter the discard pile', () => {
        state.pickUpAllCardsFromDiscardPile();

        expect(discardPile).toEqual([
            new Card(Suit.Clubs, 2),
            new Card(Suit.Diamonds, 7),
        ]);
    });

    it('does not allow any action other than picking cards', () => {
        expect(() => state.createRun([]))
            .toThrow(new ActionNotAllowedException());

        expect(() => state.meldCardsToRun([], new RunID(123)))
            .toThrow(new ActionNotAllowedException());

        expect(() => state.discard(Card.Joker()))
            .toThrow(new ActionNotAllowedException());
    });

});