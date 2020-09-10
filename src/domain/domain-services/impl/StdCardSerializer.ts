import { CardSerializer } from "../CardSerializer";
import { Card } from "../../value_objects/Card";
import { CardList } from "../../value_objects/CardList";

export class StdCardSerializer implements CardSerializer {

    serializeCard(card: Card) {
        return {
            suit: card.getSuit(),
            value: card.getValue(),
        };
    }

    serializeCards(cards: CardList): any[] {
        return cards.cards.map(this.serializeCard);
    }

    unserializeCard(card: any): Card {
        return new Card(card['suit'], card['value']);
    }

    unserializeCards(cards: any[]): CardList {
        return new CardList(cards.map(this.unserializeCard));
    }

}