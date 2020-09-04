import { MatchFactory } from "../MatchFactory";
import { IDGenerator } from "../../domain-services/IDGenerator";
import { Match } from "../../entities/Match";
import { ConcreteMatch } from "../../entities/impl/ConcreteMatch";
import { ConcreteStock } from "../../entities/impl/ConcreteStock";
import { StdCardSerializer } from "../../domain-services/impl/StdCardSerializer";
import { GamingAreaFactory } from "../GamingAreaFactory";

export class ConcreteMatchFactory implements MatchFactory {

    constructor(
        private idGenerator: IDGenerator,
        private gamingAreaFactory: GamingAreaFactory
    ) {}

    private createMatch(): ConcreteMatch {
        return new ConcreteMatch(
            new ConcreteStock(new StdCardSerializer()),
            [],
            new StdCardSerializer(),
            this.gamingAreaFactory
        );
    }

    private async generateMatchId(): Promise<number> {
        return this.idGenerator.generate();
    }

    public async createInitialized(): Promise<Match> {
        return this.generateMatchId()
            .then((matchId) => {
                const match = this.createMatch();
                match.initialize(matchId);
                return match;
            });
    }

    public createEmpty(): Match {
        return this.createMatch();
    }

}