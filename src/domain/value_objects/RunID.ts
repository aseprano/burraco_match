import { BadRunIdException } from "../exceptions/BadRunIdException";

export class RunID {

    constructor(private id: number) {
        if (id < 0 || id !== Math.floor(id)) {
            throw new BadRunIdException();
        }
    }

    public asNumber(): number {
        return this.id;
    }

}
