import { CardList } from "../value_objects/CardList";
import { Card } from "../value_objects/Card";


export class CardsShuffler {

    public static randomShuffling(source: CardList): CardList {
        const shuffledCards: Array<Card> = [];
        const sourceCards = [...source.cards];

        while (sourceCards.length) {
            shuffledCards.push(...sourceCards.splice(Math.floor(Math.random()*sourceCards.length), 1));
        }
    
        return new CardList(shuffledCards);
    }
    
    public static noShuffling(source: CardList): CardList {
        return source;
    }

}
