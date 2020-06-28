import { Card, Suit } from "../value_objects/Card";
import { CardsPickedFromDiscardPile } from "./CardsPickedFromDiscardPile"

describe("CardsPickedFromDiscardPile", () => {

    it("returns the proper payload", () => {
        const deuceOfClubs = new Card(Suit.Clubs, 2);
        const threeOfClubs = new Card(Suit.Clubs, 3);
        const joke = Card.Joker();

        const event = new CardsPickedFromDiscardPile(7, [deuceOfClubs, threeOfClubs, joke]);
        expect(event.getName()).toEqual("com.herrdoktor.buraco.events.cardsPickedFromDiscardPile");
        expect(event.getPayload()).toEqual({
            discardPileId: 7,
            cards: [
                { suit: Suit.Clubs, value: 2 },
                { suit: Suit.Clubs, value: 3 },
                { suit: Suit.Joker, value: 0 },
            ],
        });
    });

});
