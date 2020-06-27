import { RunID } from "./RunID";

describe('RunID', () => {

    it('does not accept negative ids', () => {
        expect(() => new RunID(-1)).toThrow();
    });

    it('does not accept non-integer values', () => {
        expect(() => new RunID(1.2)).toThrow();
    });

    it('accepts zero value', () => {
        const id = new RunID(0);
        expect(id.asNumber()).toEqual(0);
    });

    it('accepts any positive number', () => {
        const id = new RunID(7);
        expect(id.asNumber()).toEqual(7);
    });

})