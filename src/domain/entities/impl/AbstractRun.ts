import { Run } from "../Run";
import { RunID } from "../../value_objects/RunID";
import { Card, CardList } from "../../value_objects/Card";
import { RunException } from "../../exceptions/RunException";
import { WildcardException } from "../../exceptions/WildcardException";
import { SnapshotState } from "../../../tech/Snapshot";
import { AbstractEntity } from "./AbstractEntity";
import { Event } from "../../../tech/events/Event";

export abstract class AbstractRun extends AbstractEntity implements Run
{
    private id: RunID = new RunID(0);

    protected constructor(
        private cards: CardList,
        private wildcardPosition = -1
    ) {
        super();
    }

    private tryAddCard(card: Card): boolean {
        if (card.isJoker()) {
            if (this.hasWildcard()) {
                throw new WildcardException();
            }

            return this.addJoker(card);
        } else {
            return this.addCard(card);
        }
    }

    private tryAddCards(newCards: CardList): void {
        if (newCards.length + this.cards.length > 13) {
            throw new RunException('GameRun would become too long, only 13 cards per run are allowed');
        }

        const remainingCards = [...newCards];

        while (remainingCards.length > 0) {
            const addedCardIndex = this.addAnyOf(remainingCards);

            if (addedCardIndex === -1) { // no card added
                throw new RunException(`Cards cannot be added`);
            }

            remainingCards.splice(addedCardIndex, 1);
        }
    }

    private addAnyOf(cards: CardList): number {
        return cards.findIndex((card) => this.tryAddCard(card));
    }

    protected insertCardAt(newCard: Card, position: number) {
        this.cards.splice(position, 0, newCard);

        if (this.wildcardPosition >= position) {
            this.wildcardPosition++;
        }
    }

    protected insertCardAtTop(newCard: Card) {
        this.insertCardAt(newCard, this.cards.length);
    }

    protected insertCardAtBottom(newCard: Card) {
        this.insertCardAt(newCard, 0);
    }

    protected removeCardAt(index: number): Card {
        return this.cards.splice(index, 1)[0];
    }

    protected removeCardAtBottom(): Card {
        return this.removeCardAt(0);
    }

    protected insertWildcardAt(wildcard: Card, position: number) {
        this.cards.splice(position, 0, wildcard);
        this.wildcardPosition = position;
    }

    protected insertWildcardAtBottom(wildcard: Card) {
        this.insertWildcardAt(wildcard, 0);
    }

    protected insertWildcardAtTop(wildcard: Card) {
        this.insertWildcardAt(wildcard, this.cards.length);
    }

    protected hasWildcard(): boolean {
        return this.wildcardPosition >= 0;
    }

    protected getCardAt(pos: number): Card {
        return this.cards[pos];
    }

    protected getBottomCard(): Card {
        return this.getCardAt(0);
    }

    protected getTopCard(): Card {
        return this.getCardAt(this.cards.length-1);
    }

    protected wildcardIsTheTopmostCard(): boolean {
        return this.getWildcardPosition() === this.size() - 1;
    }

    protected wildcardIsTheBottommostCard(): boolean {
        return this.getWildcardPosition() === 0;
    }

    protected replaceWildcard(replacementCard: Card): Card {
        const wildcard = this.getCardAt(this.getWildcardPosition());
        this.cards.splice(this.getWildcardPosition(), 1, replacementCard);
        this.wildcardPosition = -1;
        return wildcard;
    }

    protected size(): number {
        return this.cards.length;
    }

    protected buildSnapshot(): SnapshotState {
        return {
            entityId: this.id.asNumber(),
            cards: this.cards.map((card) => {
                return { suit: card.getSuit(), value: card.getValue() };
            }),
            wildcardPosition: this.wildcardPosition,
        };
    }

    protected applySnapshot(snapshot: SnapshotState): void {
        this.setId(new RunID(snapshot.entityId));

        const cards: CardList = snapshot['cards']
            .map((card: {[key: string]: any}) => new Card(card['suit'], card['value']));

        this.set(cards, snapshot['wildcardPosition']);
    }

    public setId(newId: RunID): void {
        this.id = newId;
    }

    public getId(): RunID {
        return this.id;
    }

    public getCards(): CardList {
        return [...this.cards];
    }

    public getWildcardPosition(): number {
        return this.wildcardPosition;
    }

    public add(newCards: Card|CardList): Run {
        const memento = {
            cards: [...this.cards],
            wildcardPosition: this.wildcardPosition
        };

        try {
            this.tryAddCards(Array.isArray(newCards) ? newCards : [newCards]);
            return this;
        } catch (exception) {
            this.cards = memento.cards;
            this.wildcardPosition = memento.wildcardPosition;
            throw exception;
        }
    }

    public set(cards: CardList, wildcardPosition: number): void {
        this.cards = [...cards];
        this.wildcardPosition = wildcardPosition;
    }

    protected doApplyEvent(event: Event) {
    }

    protected abstract addJoker(joker: Card): boolean;

    protected abstract addCard(card: Card): boolean;

}
