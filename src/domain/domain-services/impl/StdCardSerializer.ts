import { CardSerializer } from "../CardSerializer";
import { Card, CardList } from "../../value_objects/Card";

export class StdCardSerializer implements CardSerializer {

    serializeCard(card: Card) {
        return {
            suit: card.getSuit(),
            value: card.getValue(),
        };
    }

    serializeCards(cards: CardList): any[] {
        return cards.map(this.serializeCard);
    }

    unserializeCard(card: any): Card {
        return new Card(card['suit'], card['value']);
    }

    unserializeCards(cards: any[]): CardList {
        return cards.map(this.unserializeCard);
    }

}