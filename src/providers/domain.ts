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
    ).declare(
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
    ).declare(
        'DB',
        async (c: ServiceContainer) => {
            return c.get('Config')
                .then((config: Config) => {
                    return Promise.all([
                        config.get('DB_HOST', 'localhost'),
                        config.get('DB_USER', 'root'),
                        config.get('DB_PASS', 'test'),
                        config.get('DB_NAME', 'balances')
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
    ).declare(
        'SnapshotRepository',
        async (c: ServiceContainer) => {
            return c.get('DB')
                .then((db) => new SnapshotRepositoryImpl(db, 'snapshots'));
        }
    ).declare(
        'ProjectorsRegistrationService',
        async (container: ServiceContainer) => {
            return new ConcreteProjectorRegistrationService();
        }
    ).declare(
        'ProjectionService',
        async (container: ServiceContainer) => {
            const projectorsRegtistrationService = await container.get('ProjectorsRegistrationService');
            return new ConcreteProjectionService(projectorsRegtistrationService);
        }
    ).declare(
        'CommandsMessagingSystem',
        async (container: ServiceContainer) => {
            const msg = new AMQPMessagingSystem(
                "amqp://eventbus:eventbus@localhost:5672/banking",
                uuid,
                ["xcommands"],
                "xcommands"
            );
        
            msg.startAcceptingMessages();
        
            return msg;
        }
    ).declare(
        'EventsMessagingSystem',
        async (container: ServiceContainer) => {
            const msg = new AMQPMessagingSystem(
                "amqp://eventbus:eventbus@localhost:5672/banking",
                uuid,
                ["all-events"],
                "all-events",
                "balance-queue"
            );
        
            msg.startAcceptingMessages();
        
            return msg;
        }
    ).declare(
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
    );
}
