import { StdCardSerializer } from "../../../src/domain/domain-services/impl/StdCardSerializer";
import { Card, Suit } from "../../../src/domain/value_objects/Card";
import { CardList } from "../../../src/domain/value_objects/CardList";

describe("StdCardSerializer", () => {
    const serializer = new StdCardSerializer();
    const deuceOfClubs = new Card(Suit.Clubs, 2);
    const joker = Card.Joker();

    it("serializes one card", () => {
        expect(serializer.serializeCard(deuceOfClubs))
            .toEqual({ suit: 'clubs', value: 2 });

        expect(serializer.serializeCard(joker))
            .toEqual({ suit: 'joker' });
    });

    it("serializes a list of cards", () => {
        const serializedCards = serializer.serializeCards(new CardList([deuceOfClubs, joker]));
        
        expect(serializedCards)
            .toEqual([
                { suit: 'clubs', value: 2 },
                { suit: 'joker' },
            ]);
    });

    it('unserializes one card', () => {
        expect(serializer.unserializeCard({ suit: 'clubs', value: 2 }))
            .toEqual(deuceOfClubs);
    });

    it('unserializes a list of cards', () => {
        expect(serializer.unserializeCards([
            { suit: 'clubs', value: 2 },
            { suit: 'joker', value: 0 }
        ]).cards).toEqual([ deuceOfClubs, joker ]);
    });
    
});
