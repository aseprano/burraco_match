import { Entity } from "./Entity";
import { PlayerID } from "../value_objects/PlayerID";
import { Team } from "../value_objects/Team";
import { RootEntity } from "./RootEntity";
import { Card, CardList } from "../value_objects/Card";
import { Run } from "./Run";

export interface Match extends RootEntity {

    start1vs1(gameId: number, player1: PlayerID, player2: PlayerID): void;
    
    start2vs2(gameId: number, team1: Team, team2: Team): void;
    
    takeFromStock(player: PlayerID): Card;

    pickUpDiscardPile(player: PlayerID): CardList;
    
    createRun(player: PlayerID, cards: CardList): Run;
    
}