import { Card } from "../../value_objects/Card";
import { CardList } from "../../value_objects/CardList";

export class CardsValueCalculator {

    public getValueOfCard(card: Card): number {
        if (card.isJoker()) {
            return 30;
        } else if (card.isDeuce()) {
            return 20;
        } else if (card.getValue() === 1) {
            return 15;
        } else if (card.getValue() < 8) {
            return 5;
        } else {
            return 10;
        }
    }

    public getValueOfCards(cards: CardList): number {
        return cards.asArray()
            .map(this.getValueOfCard)
            .reduce((v1, v2) => v1+v2, 0);
    }
    
}