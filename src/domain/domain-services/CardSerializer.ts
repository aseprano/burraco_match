import { Card, CardList } from "../value_objects/Card";

export interface CardSerializer {

    serializeCard(card: Card): any;
    serializeCards(cards: CardList): any[];
    unserializeCard(card: any): Card;
    unserializeCards(cards: any[]): CardList;
    
}