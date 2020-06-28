import { CardThrownToDiscardPile } from "./CardThrownToDiscardPile";
import { Card, Suit } from "../value_objects/Card";

describe("CardThrownToDiscardPile", () => {

    it("returns the proper payload", () => {
        const event = new CardThrownToDiscardPile(10, new Card(Suit.Diamonds, 9));
        expect(event.getName()).toEqual("com.herrdoktor.buraco.events.cardThrownToDiscardPile");
        expect(event.getPayload()).toEqual({
            discardPileId: 10,
            card: { suit: Suit.Diamonds, value: 9 },
        });
    });

});
