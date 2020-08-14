import { CardList } from "../value_objects/Card";

export class CardsShuffler {

    public static randomShuffling(deck: CardList): void {
        const shuffledCards: CardList = [];

        while (deck.length) {
            shuffledCards.push(...deck.splice(Math.floor(Math.random()*deck.length), 1));
        }
    
        deck.splice(0);
        deck.push(...shuffledCards);
    }
    
    public static noShuffling(deck: CardList): void {}

}
