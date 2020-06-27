import { StdCardSerializer } from "./StdCardSerializer";
import { Card, Suit } from "../../value_objects/Card";

describe("StdCardSerializer", () => {
    const serializer = new StdCardSerializer();
    const deuceOfClubs = new Card(Suit.Clubs, 2);
    const joker = Card.Joker();

    it("serializes one card", () => {
        expect(serializer.serializeCard(deuceOfClubs))
            .toEqual({ suit: Suit.Clubs, value: 2 });

        expect(serializer.serializeCard(joker))
            .toEqual({ suit: Suit.Joker, value: 0 });
    });

    it("serializes a list of cards", () => {
        expect(serializer.serializeCards([deuceOfClubs, joker]))
            .toEqual([
                { suit: Suit.Clubs, value: 2 },
                { suit: Suit.Joker, value: 0 },
            ]);
    });

    it('unserializes one card', () => {
        expect(serializer.unserializeCard({ suit: Suit.Clubs, value: 2 }))
            .toEqual(deuceOfClubs);
    });

    it('unserializes a list of cards', () => {
        expect(serializer.unserializeCards([
            { suit: Suit.Clubs, value: 2 },
            { suit: Suit.Joker, value: 0 }
        ])).toEqual([ deuceOfClubs, joker ]);
    });
    
});
