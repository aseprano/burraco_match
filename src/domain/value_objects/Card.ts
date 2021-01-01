export enum Suit {
    Joker = 0,
    Diamonds,
    Clubs,
    Spades,
    Hearts
};

export class Card {

    public static Joker(): Card {
        return new Card(Suit.Joker, 0);
    }
    
    constructor(
        private suit: Suit,
        private value: number
    ) {
        if (suit === Suit.Joker) {
            this.value = 0;
        } else if (value !== Math.floor(value) || value < 1 || value > 13) {
            throw new Error('Invalid value for card: ' + value);
        }
    }

    public getSuit(): Suit {
        return this.suit;
    }

    public getValue(): number {
        return this.value;
    }

    public isJoker(): boolean {
        return this.suit === Suit.Joker;
    }

    public isDeuce(): boolean {
        return this.getValue() === 2;
    }

    public isEqual(otherCard: Card): boolean {
        return this === otherCard || (this.suit === otherCard.suit && this.value === otherCard.value);
    }
    
}
