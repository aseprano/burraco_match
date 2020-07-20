import { Card, CardList } from "../value_objects/Card";
import { Entity } from "./Entity";

export interface Stock extends Entity {
    
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
    
}
