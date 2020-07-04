import { MatchFactory } from "../MatchFactory";
import { IDGenerator } from "../../domain-services/IDGenerator";
import { Match } from "../../entities/Match";
import { ConcreteMatch } from "../../entities/impl/ConcreteMatch";

export class ConcreteMatchFactory implements MatchFactory {

    constructor(private idGenerator: IDGenerator) {}

    public async createNew(): Promise<Match> {
        return this.idGenerator.generate()
            .then((id) => {
                const match = new ConcreteMatch();
                match.initialize(id);
                return match;
            });
    }

}