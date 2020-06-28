import { Entity } from "./Entity";
import { CardList, Card } from "../value_objects/Card";

export interface DiscardPile extends Entity {

    takeAll(): CardList;

    throwCard(newCard: Card): void;
    
}