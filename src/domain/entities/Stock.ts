import { Card, CardList } from "../value_objects/Card";

export interface Stock {

    initialize(cards: CardList): void;

    getCards(): CardList;
    
    /**
     * Pick one card from the top of the stock
     * Throws a StockEmptyException if the stock is empty
     */
    pickOne(): Card;

    /**
     * Pick some cards from the top of the stock
     * Throws a StockEmptyException if the stock has no enough cards.
     */
    pick(n: number): CardList;

    /**
     * Removes the first n cards. No excpetion is thrown if there are no enough cards.
     * @param n 
     */
    shift(n: number): void;

    isEmpty(): boolean;
    
}
