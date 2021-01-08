import { MatchFactory } from "../MatchFactory";
import { IDGenerator } from "../../domain-services/IDGenerator";
import { Match } from "../../entities/Match";
import { ConcreteMatch } from "../../entities/impl/ConcreteMatch";
import { ConcreteStock } from "../../entities/impl/ConcreteStock";
import { StdCardSerializer } from "../../domain-services/impl/StdCardSerializer";
import { GamingAreaFactory } from "../GamingAreaFactory";
import { ScoreCalculator } from "../../domain-services/ScoreCalculator";
import { Function } from '@darkbyte/herr/lib/types';
import { Injectable } from '@darkbyte/herr';

@Injectable()
export class ConcreteMatchFactory extends MatchFactory {

    constructor(
        private readonly idGenerator: IDGenerator,
        private readonly gamingAreaFactory: GamingAreaFactory,
        private readonly scoreCalculatorProvider: Function<number,ScoreCalculator>
    ) {
        super();
    }

    private createMatch(): ConcreteMatch {
        return new ConcreteMatch(
            new ConcreteStock(new StdCardSerializer()),
            [],
            new StdCardSerializer(),
            this.gamingAreaFactory,
            this.scoreCalculatorProvider
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