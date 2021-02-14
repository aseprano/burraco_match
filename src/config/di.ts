import { FactoriesList } from '@darkbyte/herr/lib/container/impl/ContainerImpl';
import { Container, FakeAuthService, IDGenerator } from '@darkbyte/herr';
import { ConcreteMatchService } from '../domain/app-services/impl/ConcreteMatchService';
import { ConcreteMatchFactory } from '../domain/factories/impl/ConcreteMatchFactory';
import { MatchesRepositoryImpl } from '../domain/repositories/impl/MatchesRepositoryImpl';
import { ConcreteRunFactory } from '../domain/factories/impl/ConcreteRunFactory';
import { ConcreteGamingAreaFactory } from '../domain/factories/impl/ConcreteGamingAreaFactory';
import { StringCardSerializer } from '../domain/domain-services/impl/StringCardSerializer';
import { StdCardSerializer } from '../domain/domain-services/impl/StdCardSerializer';
import { DomainEvent } from '../domain/events/DomainEvent';
import { EventScoreCalculator } from '../domain/domain-services/impl/EventScoreCalculator';
import { CardsValueCalculator } from '../domain/domain-services/impl/CardsValueCalculator';
import { StandardRunScoringPolicy } from '../domain/domain-services/impl/StandardRunScoringPolicy';
import { GamingAreaFactory } from '../domain/factories/GamingAreaFactory';

const singletons: FactoriesList = {
    MatchFactory: (container: Container) => {
        const cardSerializer = new StdCardSerializer();
        DomainEvent.cardSerializer = cardSerializer;
        
        return new ConcreteMatchFactory(
            container.get(IDGenerator),
            container.get(GamingAreaFactory),
            (teamId: number) => new EventScoreCalculator(
                teamId,
                cardSerializer,
                new CardsValueCalculator(),
                new StandardRunScoringPolicy(),
            )
        );
    },
    AuthService: () => {
        const users = new Map(Object.entries({
            'kdarkbyte': {username: 'darkbyte', role: 'user'},
            'kjohn':     {username: 'john',     role: 'user'},
            'kdaddy':    {username: 'daddy',    role: 'user'},
            'kmummy':    {username: 'mummy',    role: 'user'},
            'kmoo':      {username: 'moo',      role: 'user'},
        }));

        return new FakeAuthService(users);
    },
    CardSerializer: StringCardSerializer,
    RunFactory: ConcreteRunFactory,
    MatchService: ConcreteMatchService,
    MatchesRepository: MatchesRepositoryImpl,
    GamingAreaFactory: ConcreteGamingAreaFactory,
}

const transients: FactoriesList = {

}

export { singletons, transients }
