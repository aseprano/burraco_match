import { MatchID } from "./MatchID"
import { BadMatchIDException } from "../exceptions/BadMatchIDException";

describe('MatchID', () => {

    it('holds the match id', () => {
        const id = new MatchID(123);
        expect(id.asNumber()).toEqual(123);
    });

    it('must be positive', () => {
        expect(() => new MatchID(0)).toThrow(new BadMatchIDException());
        expect(() => new MatchID(-1)).toThrow(new BadMatchIDException());
    });

    it('must be an integer number', () => {
        expect(() => new MatchID(0.99)).toThrow(new BadMatchIDException());
    });

});
