import { ServiceContainer } from "../tech/impl/ServiceContainer";
import { EventStoreImpl } from "../tech/impl/events/EventStoreImpl";
import { FixedSizePool } from "../tech/impl/FixedSizePool";
import { EventStoreConnectionProxy } from "../tech/impl/events/EventStoreConnectionProxy";
import { SnapshotRepositoryImpl } from "../tech/impl/SnapshotRepositoryImpl";
import { EnvVariablesConfig, CacheConfigDecorator, CompositeConfig, RedisConfig, Config } from '@darkbyte/ts-config';
import { MySQLDB } from "../tech/impl/db/MySQLDB";
import { ConcreteProjectorRegistrationService } from "../domain/app-services/impl/ConcreteProjectorRegistrationService";
import { ConcreteProjectionService } from "../domain/app-services/impl/ConcreteProjectionService";
import { ProjectionistLogger } from "../tech/impl/projections/ProjectionistLogger";
import { ProjectionistProxy } from "../tech/impl/projections/ProjectionistProxy";
import { AMQPMessagingSystem } from "@darkbyte/messaging";
import { ProjectorRegistrationService } from "../domain/app-services/ProjectorRegistrationService";
import { ConcreteMatchService } from "../domain/app-services/impl/ConcreteMatchService";
import { ConcreteMatchFactory } from "../domain/factories/impl/ConcreteMatchFactory";
import { MatchesRepositoryImpl } from "../domain/repositories/impl/MatchesRepositoryImpl";
import { MySQLIDGenerator } from "../domain/domain-services/impl/MySQLIDGenerator";
import { ConcreteGamingAreaFactory } from "../domain/factories/impl/ConcreteGamingAreaFactory";
import { ConcreteRunFactory } from "../domain/factories/impl/ConcreteRunFactory";
import { StdCardSerializer } from "../domain/domain-services/impl/StdCardSerializer";
import { EventScoreCalculator } from "../domain/domain-services/impl/EventScoreCalculator";
import { CardsValueCalculator } from "../domain/domain-services/impl/CardsValueCalculator";
import { StandardRunScoringPolicy } from "../domain/domain-services/impl/StandardRunScoringPolicy";
import { DomainEvent } from "../domain/events/DomainEvent";
import { StringCardSerializer } from "../domain/domain-services/impl/StringCardSerializer";

const mysql = require('mysql');
const uuid = require('uuidv4').default;
const redis = require('redis');

module.exports = (container: ServiceContainer) => {
    container.declare(
        'Config',
        async () => {
            const redisCli = redis.createClient({
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                db: process.env.REDIS_DB
            });

            const redisConfig = new RedisConfig(redisCli, 'banking');
            const envConfig = new EnvVariablesConfig(process.env);
            const compositeCfg = new CompositeConfig(redisConfig).addConfigAtEnd(envConfig);
            return new CacheConfigDecorator(compositeCfg, 600);
        }
    )
    .declare(
        'EventStore',
        async (container: ServiceContainer) => {
            const config: Config = await container.get('Config');

            return Promise.all([
                config.get('EVENT_STORE_HOST',     'localhost'),
                config.get('EVENT_STORE_PORT',     1113),
                config.get('EVENT_STORE_USERNAME', 'admin'),
                config.get('EVENT_STORE_PASSWORD', 'changeit')
            ]).then((values: string[]) => {
                const pool = new FixedSizePool(
                    5,
                    () => new EventStoreConnectionProxy({
                        host: values[0],
                        port: values[1]
                    })
                );

                return new EventStoreImpl(
                    pool,
                    {
                        username: values[2],
                        password: values[3]
                    },
                    () => uuid()
                );
            });
        }
    )
    .declare(
        'DB',
        async (c: ServiceContainer) => {
            return c.get('Config')
                .then((config: Config) => {
                    return Promise.all([
                        config.get('DB_HOST', 'localhost'),
                        config.get('DB_USER', 'root'),
                        config.get('DB_PASS', 'test'),
                        config.get('DB_NAME', 'buraco')
                    ]).then((values) => {
                        const pool = mysql.createPool({
                            connectionLimit : 5,
                            host            : values[0],
                            user            : values[1],
                            password        : values[2],
                            database        : values[3],
                        });

                        return new MySQLDB(pool);
                    });
                });
        }
    )
    .declare(
        'SnapshotRepository',
        async (c: ServiceContainer) => {
            return c.get('DB')
                .then((db) => new SnapshotRepositoryImpl(db, 'snapshots'));
        }
    )
    .declare(
        'ProjectorsRegistrationService',
        async (container: ServiceContainer) => {
            return new ConcreteProjectorRegistrationService();
        }
    )
    .declare(
        'ProjectionService',
        async (container: ServiceContainer) => {
            const projectorsRegtistrationService = await container.get('ProjectorsRegistrationService');
            return new ConcreteProjectionService(projectorsRegtistrationService);
        }
    )
    .declare(
        'CommandsMessagingSystem',
        async (container: ServiceContainer) => {
            const config: Config = await container.get('Config');
            const host = await config.get('RABBITMQ_HOST');
            const port = await config.get('RABBITMQ_PORT', 5672);
            const user = encodeURIComponent(await config.get('RABBITMQ_USER'));
            const pass = encodeURIComponent(await config.get('RABBITMQ_PASS'));
            const vhost = await config.get('RABBITMQ_VHOST');

            const msg = new AMQPMessagingSystem(
                `amqp://${user}:${pass}@${host}:${port}/${vhost}`,
                uuid,
                ["xcommands"],
                "xcommands"
            );
        
            msg.startAcceptingMessages();
        
            return msg;
        }
    )
    .declare(
        'EventsMessagingSystem',
        async (container: ServiceContainer) => {
            const config: Config = await container.get('Config');
            const host = await config.get('RABBITMQ_HOST');
            const port = await config.get('RABBITMQ_PORT', 5672);
            const user = encodeURIComponent(await config.get('RABBITMQ_USER'));
            const pass = encodeURIComponent(await config.get('RABBITMQ_PASS'));
            const vhost = await config.get('RABBITMQ_VHOST');

            const msg = new AMQPMessagingSystem(
                `amqp://${user}:${pass}@${host}:${port}/${vhost}`,
                uuid,
                ["all-events"],
                "all-events",
                "matches-queue"
            );
        
            msg.startAcceptingMessages();
        
            return msg;
        }
    )
    .declare(
        'Projectionist',
        async (container: ServiceContainer) => {
            return container.get('CommandsMessagingSystem')
                .then(async (messagingService) => {
                    const projectorsRegtistrationService: ProjectorRegistrationService = await container.get('ProjectorsRegistrationService');

                    return new ProjectionistLogger(
                        new ProjectionistProxy(
                            messagingService,
                            projectorsRegtistrationService
                        ),
                        '[Projectionist]'
                    )
                });
        }
    )
    .declare(
        'CardSerializer', // to use for APIs
        async () => new StringCardSerializer()
    )
    .declare(
        'MatchService',
        async (container: ServiceContainer) => {
            const cardSerializer = new StdCardSerializer();
            DomainEvent.cardSerializer = cardSerializer;
            
            const matchFactory = new ConcreteMatchFactory(
                new MySQLIDGenerator(
                    await container.get('DB'),
                    'ids',
                    'id'
                ),
                new ConcreteGamingAreaFactory(
                    new ConcreteRunFactory(),
                    cardSerializer,
                ),
                (teamId: number) => new EventScoreCalculator(
                    teamId,
                    cardSerializer,
                    new CardsValueCalculator(),
                    new StandardRunScoringPolicy()
                )
            );

            const matchRepository = new MatchesRepositoryImpl(
                await container.get('EventStore'),
                await container.get('SnapshotRepository'),
                matchFactory
            );

            return new ConcreteMatchService(
                matchFactory,
                matchRepository
            );
        }
    )
}
