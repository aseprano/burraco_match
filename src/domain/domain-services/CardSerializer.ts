import { Card } from "../value_objects/Card";
import { CardList } from "../value_objects/CardList";

export interface CardSerializer {

    serializeCard(card: Card): any;
    serializeCards(cards: CardList): any[];
    unserializeCard(card: any): Card;
    unserializeCards(cards: any[]): CardList;
    
}