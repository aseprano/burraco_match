import { ReadyPlayerState } from '../../../src/domain/entities/impl/ReadyPlayerState';
import { ConcreteStock  } from '../../../src/domain/entities/impl/ConcreteStock';
import { Card, Suit } from "../../../src/domain/value_objects/Card";
import { CardList } from "../../../src/domain/value_objects/CardList";
import { StdCardSerializer } from "../../../src/domain/domain-services/impl/StdCardSerializer";
import { CardsShuffler } from "../../../src/domain/domain-services/CardsShuffler";
import { Stock } from "../../../src/domain/entities/Stock";
import { ActionNotAllowedException } from "../../../src/domain/exceptions/ActionNotAllowedException";
import { RunID } from "../../../src/domain/value_objects/RunID";

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

    const discardPile = [
        new Card(Suit.Clubs, 2),
        new Card(Suit.Diamonds, 7)
    ];

    const stock = createStock(new CardList(stockCards));

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
        expect(() => state.createRun(CardList.empty()))
            .toThrow(new ActionNotAllowedException());

        expect(() => state.meldCardsToRun(CardList.empty(), new RunID(123)))
            .toThrow(new ActionNotAllowedException());

        expect(() => state.throwCardToDiscardPile(Card.Joker()))
            .toThrow(new ActionNotAllowedException());
    });

});