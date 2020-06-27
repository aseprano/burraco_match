import { Entity } from "./Entity";
import { Card } from "../value_objects/Card";

export interface Stock extends Entity {

    /**
     * Pick one card from the top of the stock
     * Throws a StockEmptyException if the stock is empty
     */
    pickOneCard(): Card;

    isEmpty(): boolean;
    
}
