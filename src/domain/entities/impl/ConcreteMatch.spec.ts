import { ConcreteMatch } from "./ConcreteMatch";
import { ConcreteStock } from "../impl/ConcreteStock";
import { StdCardSerializer } from "../../domain-services/impl/StdCardSerializer";
import { MatchInitialized } from "../../events/MatchInitialized";
import { Card, Suit, CardList } from "../../value_objects/Card";
import { PlayerID } from "../../value_objects/PlayerID";
import { MatchStarted } from "../../events/MatchStarted";
import { CardsDealtToPlayer } from "../../events/CardsDealtToPlayer";
import { PotCreated } from "../../events/PotCreated";
import { FirstCardThrown } from "../../events/FirstCardThrown";
import { GameTurnToPlayer } from "../../events/GameTurnToPlayer";
import { CardsShuffler } from "../../domain-services/CardsShuffler";
import { ConcreteRunFactory } from "../../factories/impl/ConcreteRunFactory";
import { ConcreteGamingAreaFactory } from "../../factories/impl/ConcreteGamingAreaFactory";

describe('ConcreteMatch', () => {
    const serializer = new StdCardSerializer();
    const gamingAreaFactory = new ConcreteGamingAreaFactory(new ConcreteRunFactory(), serializer);

    it('can be initialized', () => {
        const stock = new ConcreteStock(serializer, CardsShuffler.noShuffling);

        const match = new ConcreteMatch(stock, [], serializer, gamingAreaFactory);
        match.initialize(7);

        expect(match.commitEvents()).toEqual([
            new MatchInitialized(7)
        ]);
    });

    it('can start a 1vs1 match', () => {
        const discardPile: CardList = [];

        const stockCards = [
            // PLAYERS CARDS
            new Card(Suit.Clubs, 1),
            new Card(Suit.Clubs, 1),
            new Card(Suit.Clubs, 2),
            new Card(Suit.Clubs, 2),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Clubs, 3),
            new Card(Suit.Clubs, 4),
            new Card(Suit.Clubs, 4),
            new Card(Suit.Clubs, 5),
            new Card(Suit.Clubs, 5),
            new Card(Suit.Clubs, 6),
            new Card(Suit.Clubs, 6),
            new Card(Suit.Clubs, 7),
            new Card(Suit.Clubs, 7),
            new Card(Suit.Clubs, 8),
            new Card(Suit.Clubs, 8),
            new Card(Suit.Clubs, 9),
            new Card(Suit.Clubs, 9),
            new Card(Suit.Clubs, 10),
            new Card(Suit.Clubs, 10),
            new Card(Suit.Clubs, 11),
            new Card(Suit.Clubs, 11),
            // POTS 1 CARDS
            new Card(Suit.Diamonds, 1),
            new Card(Suit.Diamonds, 2),
            new Card(Suit.Diamonds, 3),
            new Card(Suit.Diamonds, 4),
            new Card(Suit.Diamonds, 5),
            new Card(Suit.Diamonds, 6),
            new Card(Suit.Diamonds, 7),
            new Card(Suit.Diamonds, 8),
            new Card(Suit.Diamonds, 9),
            new Card(Suit.Diamonds, 10),
            new Card(Suit.Diamonds, 11),
            // POT 2 CARDS
            new Card(Suit.Hearts, 1),
            new Card(Suit.Hearts, 2),
            new Card(Suit.Hearts, 3),
            new Card(Suit.Hearts, 4),
            new Card(Suit.Hearts, 5),
            new Card(Suit.Hearts, 6),
            new Card(Suit.Hearts, 7),
            new Card(Suit.Hearts, 8),
            new Card(Suit.Hearts, 9),
            new Card(Suit.Hearts, 10),
            new Card(Suit.Hearts, 11),
            // FIRST CARD THROWN
            Card.Joker(),
        ];

        const stock = new ConcreteStock(serializer, CardsShuffler.noShuffling, () => stockCards);

        const match = new ConcreteMatch(stock, discardPile, serializer, gamingAreaFactory);
        match.applyEvent(new MatchInitialized(8));

        match.start1vs1(1981, new PlayerID('darkbyte'), new PlayerID('johndoe'));

        const committedEvents = match.commitEvents();

        // Ensuring that MatchStarted event has been fired
        expect(committedEvents).toEqual([
            new MatchStarted(8, 1981, stockCards, ['darkbyte'], ['johndoe']),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 1)], new PlayerID('darkbyte')),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 1)], new PlayerID('johndoe')),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 2)], new PlayerID('darkbyte')),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 2)], new PlayerID('johndoe')),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 3)], new PlayerID('darkbyte')),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 3)], new PlayerID('johndoe')),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 4)], new PlayerID('darkbyte')),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 4)], new PlayerID('johndoe')),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 5)], new PlayerID('darkbyte')),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 5)], new PlayerID('johndoe')),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 6)], new PlayerID('darkbyte')),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 6)], new PlayerID('johndoe')),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 7)], new PlayerID('darkbyte')),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 7)], new PlayerID('johndoe')),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 8)], new PlayerID('darkbyte')),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 8)], new PlayerID('johndoe')),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 9)], new PlayerID('darkbyte')),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 9)], new PlayerID('johndoe')),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 10)], new PlayerID('darkbyte')),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 10)], new PlayerID('johndoe')),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 11)], new PlayerID('darkbyte')),
            new CardsDealtToPlayer(8, [new Card(Suit.Clubs, 11)], new PlayerID('johndoe')),
            new PotCreated(
                8,
                [
                    new Card(Suit.Diamonds, 1),
                    new Card(Suit.Diamonds, 2),
                    new Card(Suit.Diamonds, 3),
                    new Card(Suit.Diamonds, 4),
                    new Card(Suit.Diamonds, 5),
                    new Card(Suit.Diamonds, 6),
                    new Card(Suit.Diamonds, 7),
                    new Card(Suit.Diamonds, 8),
                    new Card(Suit.Diamonds, 9),
                    new Card(Suit.Diamonds, 10),
                    new Card(Suit.Diamonds, 11)
                ]
            ),
            new PotCreated(
                8,
                [
                    new Card(Suit.Hearts, 1),
                    new Card(Suit.Hearts, 2),
                    new Card(Suit.Hearts, 3),
                    new Card(Suit.Hearts, 4),
                    new Card(Suit.Hearts, 5),
                    new Card(Suit.Hearts, 6),
                    new Card(Suit.Hearts, 7),
                    new Card(Suit.Hearts, 8),
                    new Card(Suit.Hearts, 9),
                    new Card(Suit.Hearts, 10),
                    new Card(Suit.Hearts, 11)
                ]
            ),
            new FirstCardThrown(8, Card.Joker()),
            new GameTurnToPlayer(8, 'darkbyte'),
        ]);
    });

});
