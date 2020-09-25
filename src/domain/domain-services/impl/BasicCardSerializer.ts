import { Card } from "../../value_objects/Card";
import { CardList } from "../../value_objects/CardList";
import { CardSerializer } from "../CardSerializer";

export class BasicCardSerializer implements CardSerializer {

    public serializeCard(card: Card) {
        return {
            suit: card.getSuit(),
            value: card.getValue(),
        };
    }

    public serializeCards(cards: CardList): any[] {
        return cards.asArray().map(this.serializeCard);
    }

    public unserializeCard(card: any): Card {
        return new Card(card.suit, card.value);
    }

    public unserializeCards(cards: any[]): CardList {
        return new CardList(cards.map(this.unserializeCard));
    }

}