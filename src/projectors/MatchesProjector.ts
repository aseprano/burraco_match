import { GameTurnToPlayer } from "../domain/events/GameTurnToPlayer";
import { MatchStarted } from "../domain/events/MatchStarted";
import { CardsDealtToPlayer } from "../domain/events/CardsDealtToPlayer";
import { CardSerializer } from "../domain/domain-services/CardSerializer";
import { PlayerPickedUpDiscardPile } from "../domain/events/PlayerPickedUpDiscardPile";
import { PlayerTookOneCardFromStock } from "../domain/events/PlayerTookOneCardFromStock";
import { CardList } from "../domain/value_objects/CardList";
import { PlayerThrewCardToDiscardPile } from "../domain/events/PlayerThrewCardToDiscardPile";
import { AbstractProjector, IncomingEvent, Injectable, Queryable } from '@darkbyte/herr';
import { StdCardSerializer } from '../domain/domain-services/impl/StdCardSerializer';
import { StringCardSerializer } from '../domain/domain-services/impl/StringCardSerializer';

@Injectable()
export class MatchesProjector extends AbstractProjector {

    constructor(
        connection: Queryable,
        private readonly eventCardSerializer: CardSerializer = new StdCardSerializer(),
        private readonly dbCardSerializer: CardSerializer = new StringCardSerializer(),
    ) {
        super(connection);
    }

    public getId(): string {
        return 'com.herrdoktor.buraco.projectors.matches';
    }

    private async addMatch(event: IncomingEvent): Promise<void> {
        return this.getConnection()
            .query(
            'INSERT INTO matches (id, number_of_players) VALUES (?, ?)',
            [
                event.getPayload().id,
                event.getPayload().team1.length * 2,
            ]
        ).then(() => undefined);
    }

    private async insertPlayer(matchId: number, playerId: string, teamId: number): Promise<void> {
        return this.getConnection().query(
            "INSERT INTO matches_players(match_id, team_id, player_id, hand) VALUES (:matchId, :teamId, :playerId, '[]')",
            {
                matchId,
                playerId,
                teamId,
            }
        ).then(() => undefined);
    }

    private async insertPlayers(event: IncomingEvent): Promise<void> {
        const matchId = event.getPayload().id;

        return Promise.all(
            event.getPayload().team1.map((player1Id: string, index: number) => {
                const player2Id = event.getPayload().team2[index];

                return Promise.all([
                    this.insertPlayer(matchId, player1Id, 0),
                    this.insertPlayer(matchId, player2Id, 1),
                ]);
            })
        ).then(() => undefined);
    }

    private async addCardsToPlayerHand(cards: CardList, playerId: string, matchId: number): Promise<void> {
        const sqlTuples = this.dbCardSerializer.serializeCards(cards).map((card) => `'$', '${card}'`).join(',');

        return this.getConnection().query(
            `UPDATE matches_players SET \`hand\` = JSON_ARRAY_APPEND(\`hand\`, ${sqlTuples}) WHERE match_id = :matchId AND player_id = :playerId`,
            {
                matchId,
                playerId,
            }
        ).then(() => undefined);
    }

    private async removeCardsFromPlayerHand(cards: CardList, playerId: string, matchId: number): Promise<void> {
        this.getConnection().query(
            'SELECT hand FROM matches_players WHERE match_id = :matchId AND player_id = :playerId',
            {
                matchId,
                playerId
            }
        )
        .then((res) => res.fields[0])
        .then(async (row) => {
            if (!row) {
                console.log(`Hand not found in DB`);
                return;
            }

            const newHand = this.dbCardSerializer.unserializeCards(JSON.parse(row.hand)).remove(cards);

            return this.getConnection().query(
                'UPDATE matches_players SET hand = :newHand WHERE match_id = :matchId AND player_id = :playerId',
                {
                    newHand: JSON.stringify(this.dbCardSerializer.serializeCards(newHand)),
                    matchId,
                    playerId
                }
            )
        });
    }

    private async handleMatchStarted(event: IncomingEvent): Promise<void> {
        return this.addMatch(event)
            .then(() => this.insertPlayers(event));
    }

    private async handleGameTurnToPlayer(event: IncomingEvent): Promise<void> {
        return this.getConnection().query(
            'UPDATE matches SET current_player = :playerId WHERE id = :matchId',
            {
                playerId: event.getPayload().player_id,
                matchId: event.getPayload().match_id
            }
        ).then(() => undefined);
    }
    
    private async handleCardsDealtToPlayer(event: IncomingEvent): Promise<void> {
        const eventPayload: {[key: string]: any} = event.getPayload(); 
        const cards = this.eventCardSerializer.unserializeCards(eventPayload.cards || [eventPayload.card]);

        return this.addCardsToPlayerHand(
            cards,
            eventPayload.player_id,
            eventPayload.match_id,
        );
    }

    private async handlePlayerThrewCardToDiscardPile(event: IncomingEvent): Promise<void> {
        const eventPayload: {[key: string]: any} = event.getPayload(); 
        const card = this.eventCardSerializer.unserializeCard(eventPayload.card);

        this.removeCardsFromPlayerHand(
            new CardList(card),
            eventPayload.player_id,
            eventPayload.match_id,
        );
    }

    public getEventsOfInterest(): string[] {
        return [
            MatchStarted.EventName,
            GameTurnToPlayer.EventName,
            CardsDealtToPlayer.EventName,
            PlayerPickedUpDiscardPile.EventName,
            PlayerTookOneCardFromStock.EventName,
            PlayerThrewCardToDiscardPile.EventName,
        ];
    }

    public async projectEvent(event: IncomingEvent): Promise<void> {
        switch (event.getName()) {
            case MatchStarted.EventName:
                return this.handleMatchStarted(event);

            case GameTurnToPlayer.EventName:
                return this.handleGameTurnToPlayer(event);

            case CardsDealtToPlayer.EventName:
            case PlayerPickedUpDiscardPile.EventName:
            case PlayerTookOneCardFromStock.EventName:
                return this.handleCardsDealtToPlayer(event);

            case PlayerThrewCardToDiscardPile.EventName:
                return this.handlePlayerThrewCardToDiscardPile(event);
        }
    }

    public async clear(): Promise<void> {
        return this.getConnection()
            .query('DELETE FROM matches')
            .then(() => {});
    }

}