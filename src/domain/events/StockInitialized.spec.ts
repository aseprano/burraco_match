import { StockInitialized } from "./StockInitialized";
import { Card, Suit } from "../value_objects/Card";

describe("StockInitalized", () => {

    it("returns the proper payload", () => {
        const event = new StockInitialized(
            10,
            123,
            [
                new Card(Suit.Clubs, 7),
                Card.Joker()
            ]
        );

        expect(event.getPayload()).toEqual({
            id: 10,
            matchId: 123,
            cards: [
                { suit: Suit.Clubs, value: 7 },
                { suit: Suit.Joker, value: 0 },
            ]
        });

        expect(event.getName()).toEqual("com.herrdoktor.buraco.events.stockInitialized");
    });

});
