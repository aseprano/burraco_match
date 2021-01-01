import { AppConfig, LogLevel } from '@darkbyte/herr';
import { singletons, transients } from './di';
import { routes } from './routes';
import { projectors } from './projectors';

export default {
    singletonsFactories: singletons,
    transientFactories: transients,
    logLevel: LogLevel.DEBUG,
    amqpConfig: {
        host: process.env.AMQP_HOST || 'localhost',
        port: process.env.AMQP_PORT || 5672,
        username: process.env.AMQP_USER || 'burraco',
        password: process.env.AMQP_PASS || 'burraco',
        vhost: process.env.AMQP_VHOST || 'burraco',
        inputExchange: process.env.AMQP_IN_EXCH || 'events',
        outputExchange: process.env.AMQP_OUT_EXCH || 'events',
        inputQueue: process.env.AMQP_IN_QUEUE || 'burraco_match'
    },
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_HOST || 12345,
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'test',
        dbname: process.env.DB_NAME || 'burraco',
        pool: {
            min: process.env.DB_POOL_MIN || 0,
            max: process.env.DB_POOL_MAX || 10,
        }
    },
    eventStore: {
        host: process.env.EVENTSTORE_HOST || 'localhost',
        port: process.env.EVENTSTORE_PORT || 1113,
        username: process.env.EVENTSTORE_USER || 'admin',
        password: process.env.EVENTSTORE_PASS || 'changeit!',
        poolSize: {
            min: 1,
            max: 5,
        }
    },
    projections: {
        registryTableName: 'projections',
        projectorsClasses: projectors,
    },
    web: {
        port: process.env.WEBPORT || 8080,
        routes
    },
} as AppConfig