import { DBAbstractProjector } from "./DBAbstractProjector";
import { Queryable } from "../tech/db/Queryable";
import { IncomingEvent } from "../tech/impl/events/IncomingEvent";

import { GameTurnToPlayer } from "../domain/events/GameTurnToPlayer";
import { MatchStarted } from "../domain/events/MatchStarted";
import { CardsDealtToPlayer } from "../domain/events/CardsDealtToPlayer";
import { CardSerializer } from "../domain/domain-services/CardSerializer";
import { time } from "console";

export class MatchesProjector extends DBAbstractProjector {

    constructor(
        private eventCardSerializer: CardSerializer,
        private dbCardSerializer: CardSerializer
    ) {
        super();
    }

    public getId(): string {
        return 'com.herrdoktor.buraco.projectors.matches';
    }

    private async addMatch(event: IncomingEvent, connection: Queryable): Promise<void> {
        return connection.query(
            'INSERT INTO matches (id, number_of_players) VALUES (?, ?)',
            [
                event.getPayload().id,
                event.getPayload().team1.length * 2,
            ]
        ).then(() => undefined);
    }

    private async insertPlayer(matchId: number, playerId: string, teamId: number, connection: Queryable): Promise<void> {
        return connection.query(
            "INSERT INTO matches_players(match_id, team_id, player_id, hand) VALUES (:matchId, :teamId, :playerId, '[]')",
            {
                matchId,
                playerId,
                teamId,
            }
        ).then(() => undefined);
    }

    private async insertPlayers(event: IncomingEvent, connection: Queryable): Promise<void> {
        const matchId = event.getPayload().id;

        return Promise.all(
            event.getPayload().team1.map((player1Id: string, index: number) => {
                const player2Id = event.getPayload().team2[index];

                return Promise.all([
                    this.insertPlayer(matchId, player1Id, 0, connection).then(() => undefined),
                    this.insertPlayer(matchId, player2Id, 1, connection).then(() => undefined),
                ]);
            })
        ).then(() => undefined);
    }

    private async handleMatchStarted(event: IncomingEvent, connection: Queryable): Promise<void> {
        return this.addMatch(event, connection)
            .then(() => this.insertPlayers(event, connection));
    }

    private async handleGameTurnToPlayer(event: IncomingEvent, connection: Queryable): Promise<void> {
        return connection.query(
            'UPDATE matches SET current_player = :playerId WHERE id = :matchId',
            {
                playerId: event.getPayload().player_id,
                matchId: event.getPayload().match_id
            }
        ).then(() => undefined);
    }
    
    private async handleCardsDealtToPlayer(event: IncomingEvent, connection: Queryable): Promise<void> {
        const cards = this.eventCardSerializer.unserializeCards(event.getPayload().cards);
        const tuples = this.dbCardSerializer.serializeCards(cards).map((card) => `'$', '${card}'`).join(',');

        return connection.query(
            `UPDATE matches_players SET \`hand\` = JSON_ARRAY_APPEND(\`hand\`, ${tuples}) WHERE match_id = :matchId AND player_id = :playerId`,
            {
                matchId: event.getPayload().match_id,
                playerId: event.getPayload().player_id
            }
        ).then(() => undefined);
    }

    public getEventsOfInterest(): string[] {
        return [
            MatchStarted.EventName,
            GameTurnToPlayer.EventName,
            CardsDealtToPlayer.EventName,
        ];
    }

    public handleIncomingEvent(event: IncomingEvent, connection: Queryable): Promise<void> {
        switch (event.getName()) {
            case MatchStarted.EventName:
                return this.handleMatchStarted(event, connection);

            case GameTurnToPlayer.EventName:
                return this.handleGameTurnToPlayer(event, connection);

            case CardsDealtToPlayer.EventName:
                return this.handleCardsDealtToPlayer(event, connection);
        }

        return Promise.resolve();
    }

    public handleClear(connection: Queryable): Promise<void> {
        return connection.query('DELETE FROM matches')
            .then(() => {});
    }

}