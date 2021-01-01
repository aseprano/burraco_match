import { Injectable } from '@darkbyte/herr';
import { Card } from "../value_objects/Card";
import { CardList } from "../value_objects/CardList";

@Injectable()
export abstract class CardSerializer {

    public abstract serializeCard(card: Card): any;

    public abstract serializeCards(cards: CardList): any[];

    public abstract unserializeCard(card: any): Card;

    public abstract unserializeCards(cards: any[]): CardList;
    
}