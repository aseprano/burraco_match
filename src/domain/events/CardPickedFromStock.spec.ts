import { CardPickedFromStock } from "./CardPickedFromStock";
import { Card, Suit } from "../value_objects/Card";

describe("CardPickedFromStock", () => {

    it("returns the proper payload", () => {
        const event = new CardPickedFromStock(10, new Card(Suit.Diamonds, 8));
        expect(event.getName()).toEqual("com.herrdoktor.buraco.events.cardPickedFromStock");
        expect(event.getPayload()).toEqual({
            stockId: 10,
            card: { suit: Suit.Diamonds, value: 8 },
        });
    });

});
