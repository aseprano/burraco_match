import { MatchEnded } from './MatchEnded';

describe('MatchEnded', () => {

    it('builds the proper payload', () => {
        expect(MatchEnded.EventName).toEqual('com.herrdoktor.buraco.events.MatchEnded');

        const event = new MatchEnded(
            123,
            {
                closing: 100,
                pot: 200,
                hand: 300,
                buracos: 400,
                runs: 500,
                total: 1500,
            },
            {
                closing: 500,
                pot: 400,
                hand: 300,
                buracos: 100,
                runs: 100,
                total: 1000,
            }
        );

        expect(event.getName()).toEqual(MatchEnded.EventName);

        expect(event.getPayload()).toEqual({
            match_id: 123,
            team1_score: {
                closing: 100,
                pot: 200,
                hand: 300,
                buracos: 400,
                runs: 500,
                total: 1500,
            },
            team2_score: {
                closing: 500,
                pot: 400,
                hand: 300,
                buracos: 100,
                runs: 100,
                total: 1000,
            }
        });
    });

});
