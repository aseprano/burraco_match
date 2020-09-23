import { Event } from "../../../tech/events/Event";
import { CardsDealtToPlayer } from "../../events/CardsDealtToPlayer";
import { MatchStarted } from "../../events/MatchStarted";
import { Card } from "../../value_objects/Card";
import { CardList } from "../../value_objects/CardList";
import { Score } from "../../value_objects/Score";
import { CardSerializer } from "../CardSerializer";
import { CardsValueCalculator } from "./CardsValueCalculator";
import { ScoreCalculator } from "../ScoreCalculator";
import { PlayerPickedUpDiscardPile } from "../../events/PlayerPickedUpDiscardPile";
import { PlayerTookOneCardFromStock } from "../../events/PlayerTookOneCardFromStock";
import { PlayerThrewCardToDiscardPile } from "../../events/PlayerThrewCardToDiscardPile";
import { RunCreated } from "../../events/RunCreated";
import { CardsMeldedToRun } from "../../events/CardsMeldedToRun";
import { PlayerTookPot } from "../../events/PlayerTookPot";
import { RunScoringPolicy } from "../RunScoringPolicy";

export class EventScoreCalculator implements ScoreCalculator {
    private events: Array<Event> = [];
    private players: Array<string> = [];
    private runScoring: Map<number, number> = new Map();
    private numberOfCardsPerPlayer: Map<string, number> = new Map();
    private handPenality = 0;
    private tableScore = 0;
    private potTakenBy = ''; // set to the playerId that takes the pot
    private matchEnded = false; // set to true when one player of the team ends the match

    constructor(
        private teamNumber: number, // 0 or 1
        private cardSerializer: CardSerializer,
        private cardsValueCalculator: CardsValueCalculator,
        private runScoringPolicy: RunScoringPolicy,
    ) {

    }

    private potHasBeenTaken(): boolean {
        return this.potTakenBy === '';
    }

    private getNumberOfCardsForPlayer(playerId: string): number {
        return this.numberOfCardsPerPlayer.get(playerId) || 0;
    }

    private setNumberOfCardsForPlayer(playerId: string, numberOfCards: number) {
        this.numberOfCardsPerPlayer.set(playerId, numberOfCards);
    }

    private increaseNumberOfPlayerCardsBy(playerId: string, delta: number) {
        this.setNumberOfCardsForPlayer(
            playerId,
            this.getNumberOfCardsForPlayer(playerId) + delta
        );
    }

    private increaseHandPenalityBy(value: number) {
        this.handPenality -= value;
    }

    private decreaseHandPenalityBy(value: number) {
        this.decreaseHandPenalityBy(-value);
    }

    private increaseHandPenality(cards: Card|CardList) {
        let cardsValue;

        if (cards instanceof CardList) {
            cardsValue = this.cardsValueCalculator.getValueOfCards(cards);
        } else {
            cardsValue = this.cardsValueCalculator.getValueOfCard(cards);
        }

        this.increaseHandPenalityBy(cardsValue);
    }

    private decreaseHandPenality(cards: Card|CardList) {
        let cardsValue;

        if (cards instanceof CardList) {
            cardsValue = this.cardsValueCalculator.getValueOfCards(cards);
        } else {
            cardsValue = this.cardsValueCalculator.getValueOfCard(cards);
        }

        this.decreaseHandPenalityBy(cardsValue);
    }

    private isEventOfInterest(event: Event): boolean {
        return event.getName() === MatchStarted.EventName ||
            this.players.indexOf(event.getPayload().player_id) !== -1;
    }

    private getCardsFromEvent(cards: Array<any>): CardList {
        return this.cardSerializer.unserializeCards(cards);
    }

    private onMatchStarted(event: Event) {
        this.players = this.teamNumber === 0 ? event.getPayload().team1Players : event.getPayload().team2Players;
    }

    private onCardsDealtToPlayer(event: Event) {
        const cardsDealt = this.getCardsFromEvent(event.getPayload().cards);
        this.increaseHandPenality(cardsDealt);
        this.increaseNumberOfPlayerCardsBy(event.getPayload().player_id, cardsDealt.length);
    }

    private onPlayerPickedUpDiscardPile(event: Event) {
        const cardsPickedUp = this.cardSerializer.unserializeCards(event.getPayload().cards);
        this.increaseHandPenality(cardsPickedUp);
        this.increaseNumberOfPlayerCardsBy(event.getPayload().player_id, cardsPickedUp.length);
    }

    private onPlayerTookOneCardFromStock(event: Event) {
        const card = this.cardSerializer.unserializeCard(event.getPayload().card);
        this.increaseHandPenality(card);
        this.increaseNumberOfPlayerCardsBy(event.getPayload().player_id, 1);
    }

    private onPlayerThrewOneCardToDiscardPile(event: Event) {
        const card = this.cardSerializer.unserializeCard(event.getPayload().card);
        this.decreaseHandPenality(card);
        this.increaseNumberOfPlayerCardsBy(event.getPayload().player_id, -1);

        if (this.getNumberOfCardsForPlayer(event.getPayload().player_id) === 0 && this.potHasBeenTaken()) {
            this.matchEnded = true;
        }
    }

    private onRunCreated(event: Event) {
        const runCards = this.cardSerializer.unserializeCards(event.getPayload().run.cards);
        const cardsValue = this.cardsValueCalculator.getValueOfCards(runCards);
        this.decreaseHandPenalityBy(cardsValue);
        this.tableScore += cardsValue;
        
        this.runScoring.set(
            event.getPayload().run.id,
            this.runScoringPolicy.getScore(runCards, event.getPayload().run.wildcard_position)
        );

        this.increaseNumberOfPlayerCardsBy(event.getPayload().player_id, -runCards.length);
    }

    private onRunUpdated(event: Event) {
        const newCards = this.cardSerializer.unserializeCards(event.getPayload().cards);
        const runCards = this.cardSerializer.unserializeCards(event.getPayload().run.cards);
        const valueOfNewCards = this.cardsValueCalculator.getValueOfCards(newCards);
        this.decreaseHandPenalityBy(valueOfNewCards);
        this.tableScore += valueOfNewCards;

        this.runScoring.set(
            event.getPayload().run.id,
            this.runScoringPolicy.getScore(runCards, event.getPayload().run.wildcard_position)
        );

        this.increaseNumberOfPlayerCardsBy(event.getPayload().player_id, -newCards.length);
    }

    private onPotTaken(event: Event) {
        const playerId = event.getPayload().player_id;
        const pot = this.cardSerializer.unserializeCards(event.getPayload().cards);

        this.potTakenBy = playerId;
        this.increaseHandPenality(pot);
        this.increaseNumberOfPlayerCardsBy(playerId, pot.length);
    }

    private onEvent(event: Event) {
        if (!this.isEventOfInterest(event)) {
            return;
        }

        switch (event.getName()) {
            case MatchStarted.EventName:
                this.onMatchStarted(event);
                break;

            case CardsDealtToPlayer.EventName:
                this.onCardsDealtToPlayer(event);
                break;

            case PlayerPickedUpDiscardPile.EventName:
                this.onPlayerPickedUpDiscardPile(event);
                break;

            case PlayerTookOneCardFromStock.EventName:
                this.onPlayerTookOneCardFromStock(event);
                break;

            case PlayerThrewCardToDiscardPile.EventName:
                this.onPlayerThrewOneCardToDiscardPile(event);
                break;

            case RunCreated.EventName:
                this.onRunCreated(event);
                break;

            case CardsMeldedToRun.EventName:
                this.onRunUpdated(event);
                break;

            case PlayerTookPot.EventName:
                this.onPotTaken(event);
                break;
        }
    }

    private runEvents(): void {
        this.events.forEach((e) => this.onEvent(e));
    }

    public applyEvent(event: Event): void {
        this.events.push(event);
    }

    public getScore(): Score {
        this.runEvents();

        const values = {
            buracos: Array.from(this.runScoring.entries()).reduce((total, score) => total+score[1], 0),
            hand: this.handPenality,
            runs: this.tableScore,
            closing: this.matchEnded ? 100 : 0,
            pot: this.potHasBeenTaken() ? 100 : -100,
        };

        return {
            ...values,
            total: values.buracos + values.hand + values.runs + values.closing + values.pot,
        };
    }

}