import { Event } from "../../tech/events/Event";
import { Score } from "../value_objects/Score";

export interface ScoreCalculator {
    applyEvent(event: Event): void;
    getScore(): Score;
}