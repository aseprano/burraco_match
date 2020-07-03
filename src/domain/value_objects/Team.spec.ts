import { Team } from "./Team";
import { PlayerID } from "./PlayerID";
import { BadTeamException } from "../exceptions/BadTeamException";

describe('Team', () => {
    
    it('holds the players', () => {
        const player1 = new PlayerID('darkbyte');
        const player2 = new PlayerID('johndoe');
        const team = new Team(player1, player2);
        expect(team.getPlayer1()).toEqual(player1);
        expect(team.getPlayer2()).toEqual(player2);
    });

    it('must contain different players', () => {
        expect(() => new Team(new PlayerID('darkbyte'), new PlayerID('darkbyte'))).toThrow(new BadTeamException());
    });

});
