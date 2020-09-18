import { Card } from "../value_objects/Card";
import { CardList } from "../value_objects/CardList";
import { Entity } from "./Entity";

export interface Stock extends Entity {
    
    /**
     * Returns the cards the stock contains.
     * The list is a copy of the internal one, so changing it won't affect the stock.
     */
    getCards(): CardList;

    /**
     * Initializes and shuffles the stock.
     * The result is a 108-cards stock.
     */
    shuffle(): void;

    /**
     * Pick one card from the top of the stock
     * Throws a StockEmptyException if the stock is empty
     */
    takeOne(): Card;

    /**
     * Pick some cards from the top of the stock
     * Throws a StockEmptyException if the stock has no enough cards.
     */
    take(n: number): CardList;
    
}
