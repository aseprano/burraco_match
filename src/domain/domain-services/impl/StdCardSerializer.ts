import { CardSerializer } from "../CardSerializer";
import { Card, Suit } from "../../value_objects/Card";
import { CardList } from "../../value_objects/CardList";

interface CardObject {
    suit: string;
    value?: number;
}

export class StdCardSerializer implements CardSerializer {
    private suitToString: {[key: number]: string} = {};
    private stringToSuit: {[key: string]: Suit};

    constructor() {
        this.suitToString[Suit.Clubs] = 'clubs';
        this.suitToString[Suit.Diamonds] = 'diamonds';
        this.suitToString[Suit.Hearts] = 'hearts';
        this.suitToString[Suit.Spades] = 'spades';
        this.suitToString[Suit.Joker] = 'joker';

        this.stringToSuit = {
            'clubs': Suit.Clubs,
            'diamonds': Suit.Diamonds,
            'hearts': Suit.Hearts,
            'spades': Suit.Spades,
            'joker': Suit.Joker,
        };
    }

    public serializeCard(card: Card): any {
        const ret: CardObject = {
            suit: this.suitToString[card.getSuit()],
        };

        if (!card.isJoker()) {
            ret.value = card.getValue();
        }

        return ret;
    }

    public serializeCards(cards: CardList): any[] {
        return cards.asArray().map((card) => this.serializeCard(card));
    }

    public unserializeCard(card: any): Card {
        if (typeof card.suit === 'string') {
            return new Card(this.stringToSuit[card.suit], card.value);
        } else {
            return new Card(card.suit, card.value);
        }
    }

    public unserializeCards(cards: any[]): CardList {
        return new CardList(cards.map((card) => this.unserializeCard(card)));
    }

}