import { MatchFactory } from "../MatchFactory";
import { IDGenerator } from "../../domain-services/IDGenerator";
import { Match } from "../../entities/Match";
import { ConcreteMatch } from "../../entities/impl/ConcreteMatch";
import { ConcreteStock } from "../../entities/impl/ConcreteStock";
import { StdCardSerializer } from "../../domain-services/impl/StdCardSerializer";

export class ConcreteMatchFactory implements MatchFactory {

    constructor(private idGenerator: IDGenerator) {}

    private createMatch(): ConcreteMatch {
        return new ConcreteMatch(
            new ConcreteStock(new StdCardSerializer()),
            [],
            new StdCardSerializer()
        );
    }

    public async createInitialized(): Promise<Match> {
        return this.idGenerator.generate()
            .then((id) => {
                const match = this.createMatch();
                match.initialize(id);
                return match;
            });
    }

    public createEmpty(): Match {
        return this.createMatch();
    }

}