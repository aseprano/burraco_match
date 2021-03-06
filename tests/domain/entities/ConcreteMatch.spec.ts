import { ConcreteMatch } from "../../../src/domain/entities/impl/ConcreteMatch";
import { ConcreteStock } from "../../../src/domain/entities/impl/ConcreteStock";
import { StdCardSerializer } from "../../../src/domain/domain-services/impl/StdCardSerializer";
import { MatchInitialized } from "../../../src/domain/events/MatchInitialized";
import { Card, Suit } from "../../../src/domain/value_objects/Card";
import { CardList } from "../../../src/domain/value_objects/CardList";
import { PlayerID } from "../../../src/domain/value_objects/PlayerID";
import { MatchStarted } from "../../../src/domain/events/MatchStarted";
import { CardsDealtToPlayer } from "../../../src/domain/events/CardsDealtToPlayer";
import { PotCreated } from "../../../src/domain/events/PotCreated";
import { FirstCardThrown } from "../../../src/domain/events/FirstCardThrown";
import { GameTurnToPlayer } from "../../../src/domain/events/GameTurnToPlayer";
import { CardsShuffler } from "../../../src/domain/domain-services/CardsShuffler";
import { ConcreteRunFactory } from "../../../src/domain/factories/impl/ConcreteRunFactory";
import { ConcreteGamingAreaFactory } from "../../../src/domain/factories/impl/ConcreteGamingAreaFactory";
import { EventScoreCalculator } from "../../../src/domain/domain-services/impl/EventScoreCalculator";
import { CardsValueCalculator } from "../../../src/domain/domain-services/impl/CardsValueCalculator";
import { StandardRunScoringPolicy } from "../../../src/domain/domain-services/impl/StandardRunScoringPolicy";

describe('ConcreteMatch', () => {
    const serializer = new StdCardSerializer();
    const gamingAreaFactory = new ConcreteGamingAreaFactory(new ConcreteRunFactory(), serializer);

    const scoreCalculatorProvider = (teamNumber: number) => {
        return new EventScoreCalculator(
            teamNumber,
            serializer,
            new CardsValueCalculator(),
            new StandardRunScoringPolicy()
        );
    };

    it('can be initialized', () => {
        const stock = new ConcreteStock(serializer, CardsShuffler.noShuffling);

        const match = new ConcreteMatch(stock, [], serializer, gamingAreaFactory, scoreCalculatorProvider);
        match.initialize(7);

        expect(match.commitEvents()).toEqual([
            new MatchInitialized(7)
        ]);
    });

    it('can start a 1vs1 match', () => {
        const discardPile = new CardList();

        const stockCards = new CardList([
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
        ]);

        const stock = new ConcreteStock(serializer, CardsShuffler.noShuffling, () => stockCards);

        const match = new ConcreteMatch(stock, [...discardPile.asArray()], serializer, gamingAreaFactory, scoreCalculatorProvider);
        match.applyEvent(new MatchInitialized(8));

        match.start1vs1(1981, new PlayerID('darkbyte'), new PlayerID('johndoe'));

        const committedEvents = match.commitEvents();

        // Ensuring that MatchStarted event has been fired
        expect(committedEvents).toEqual([
            new MatchStarted(8, 1981, stockCards, ['darkbyte'], ['johndoe']),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 1)]), 'darkbyte'),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 1)]), 'johndoe'),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 2)]), 'darkbyte'),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 2)]), 'johndoe'),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 3)]), 'darkbyte'),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 3)]), 'johndoe'),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 4)]), 'darkbyte'),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 4)]), 'johndoe'),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 5)]), 'darkbyte'),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 5)]), 'johndoe'),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 6)]), 'darkbyte'),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 6)]), 'johndoe'),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 7)]), 'darkbyte'),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 7)]), 'johndoe'),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 8)]), 'darkbyte'),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 8)]), 'johndoe'),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 9)]), 'darkbyte'),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 9)]), 'johndoe'),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 10)]), 'darkbyte'),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 10)]), 'johndoe'),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 11)]), 'darkbyte'),
            new CardsDealtToPlayer(8, new CardList([new Card(Suit.Clubs, 11)]), 'johndoe'),
            new PotCreated(
                8,
                new CardList([
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
                ])
            ),
            new PotCreated(
                8,
                new CardList([
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
                ])
            ),
            new FirstCardThrown(8, Card.Joker()),
            new GameTurnToPlayer(8, 'darkbyte'),
        ]);
    });

});
