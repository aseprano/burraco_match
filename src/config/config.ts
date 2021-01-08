import { AppConfig, LogLevel } from '@darkbyte/herr';
import { singletons, transients } from './di';
import { routes } from './routes';
import { projectors } from './projectors';

export default {
    singletonsFactories: singletons,
    transientFactories: transients,
    logLevel: LogLevel.DEBUG,
    amqpConfig: {
        host: process.env.RABBITMQ_HOST || 'localhost',
        port: process.env.RABBITMQ_PORT || 5672,
        username: process.env.RABBITMQ_USER || 'burraco',
        password: process.env.RABBITMQ_PASS || 'burraco',
        vhost: process.env.RABBITMQ_VHOST || 'burraco',
        inputExchange: process.env.AMQP_IN_EXCH || 'events',
        outputExchange: process.env.AMQP_OUT_EXCH || 'events',
        inputQueue: process.env.AMQP_IN_QUEUE || 'matches-queue'
    },
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'test',
        dbname: process.env.DB_NAME || 'buraco',
        pool: {
            min: process.env.DB_POOL_MIN || 0,
            max: process.env.DB_POOL_MAX || 10,
        },
        idGenerator: {
            tableName: 'ids',
            columnName: 'id'
        }
    },
    eventStore: {
        host: process.env.EVENT_STORE_HOST || 'localhost',
        port: process.env.EVENT_STORE_PORT || 1113,
        username: process.env.EVENT_STORE_USERNAME || 'admin',
        password: process.env.EVENT_STORE_PASSWORD || 'changeit!',
        poolSize: {
            min: 1,
            max: 5,
        }
    },
    projections: {
        registryTableName: 'handled_events',
        projectorsClasses: projectors,
    },
    web: {
        port: process.env.PORT || 8080,
        routes
    },
} as AppConfig