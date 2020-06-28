import { DiscardPileInitialized } from "./DiscardPileInitialized";

describe("DiscardPileInitialized", () => {

    it("returns the proper payload", () => {
        const event = new DiscardPileInitialized(10, 123);

        expect(event.getPayload()).toEqual({
            id: 10,
            matchId: 123
        });

        expect(event.getName()).toEqual("com.herrdoktor.buraco.events.discardPileInitialized");
    });

});
