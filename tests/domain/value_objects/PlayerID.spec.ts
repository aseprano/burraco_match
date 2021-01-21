import { PlayerID } from "../../../src/domain/value_objects/PlayerID";
import { BadPlayerIDException } from "../../../src/domain/exceptions/BadPlayerIDException";

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
