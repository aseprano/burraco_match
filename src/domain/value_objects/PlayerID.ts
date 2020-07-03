import { BadPlayerIDException } from "../exceptions/BadPlayerIDException";

export class PlayerID {

    /**
     * @param id 
     * @throws BadPlayerIDException
     */
    constructor(private id: string) {
        if (typeof id !== 'string' || !this.isValidId(id)) {
            throw new BadPlayerIDException();
        }
    }

    private isValidId(id: string): boolean {
        return /^[a-z0-9\-_]+$/i.test(id);
    }

    public asString(): string {
        return this.id;
    }

    public equals(player: PlayerID): boolean {
        return this === player || this.id === player.id;
    }

}