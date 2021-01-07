import { Injectable } from '@darkbyte/herr';
import { BadCardFormatException } from "../../exceptions/BadCardFormatException";
import { Card, Suit } from "../../value_objects/Card";
import { CardList } from "../../value_objects/CardList";
import { CardSerializer } from "../CardSerializer";

@Injectable()
export class StringCardSerializer implements CardSerializer {
    private suitToString: {[key: number]: string};
    private stringToSuits: {[key: string]: Suit};

    constructor() {
        this.suitToString = {
            [Suit.Clubs]:    'C',
            [Suit.Diamonds]: 'D',
            [Suit.Spades]:   'S',
            [Suit.Hearts]:   'H',
        };

        this.stringToSuits = {
            'S': Suit.Spades,
            'C': Suit.Clubs,
            'D': Suit.Diamonds,
            'H': Suit.Hearts,
        };
    }

    public serializeCard(card: Card) {
        if (card.isJoker()) {
            return '*';
        } else {
            return `${card.getValue()}${this.suitToString[card.getSuit()]}`;
        }
    }

    public serializeCards(cards: CardList): any[] {
        return cards.asArray().map(this.serializeCard.bind(this));
    }

    public unserializeCard(card: any): Card {
        if (typeof card !== 'string') {
            throw new BadCardFormatException();
        }

        if (card === '*') {
            return Card.Joker();
        }

        const matches = card.match(/^((?:1[0-3])|[1-9])([SDHC])$/);

        if (!matches) {
            throw new BadCardFormatException();
        }

        return new Card(this.stringToSuits[matches[2]], parseInt(matches[1], 10));
    }

    public unserializeCards(cards: any[]): CardList {
        return new CardList(cards.map(this.unserializeCard.bind(this)));
    }

}