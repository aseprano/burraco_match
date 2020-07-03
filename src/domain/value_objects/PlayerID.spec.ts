import { PlayerID } from "./PlayerID";
import { BadPlayerIDException } from "../exceptions/BadPlayerIDException";

describe('PlayerID', () => {

    it('holds the playerid', () => {
        const player = new PlayerID('john');
        expect(player.asString()).toEqual('john');
    });

    it('cannot be empty', () => {
        expect(() => new PlayerID('')).toThrow(new BadPlayerIDException());
    });

    it('cannot contain whitespaces', () => {
        expect(() => new PlayerID(' ')).toThrow(new BadPlayerIDException());
        expect(() => new PlayerID('john ')).toThrow(new BadPlayerIDException());
        expect(() => new PlayerID(' john')).toThrow(new BadPlayerIDException());
        expect(() => new PlayerID('jo hn')).toThrow(new BadPlayerIDException());
    });

});
