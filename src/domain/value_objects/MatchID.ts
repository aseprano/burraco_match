import { BadMatchIDException } from "../exceptions/BadMatchIDException";

export class MatchID {

    constructor(private id: number) {
        if (typeof id !== 'number' || id <= 0 || id !== Math.floor(id)) {
            throw new BadMatchIDException();
        }
    }

    public asNumber(): number {
        return this.id;
    }

}