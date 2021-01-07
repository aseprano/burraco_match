import config from './config/config';
import { Microservice } from "@darkbyte/herr";
import { TokensRegistry } from './domain/app-services/TokensRegistry';
import { FakeAuthenticationService } from './domain/app-services/impl/FakeAuthenticationService';
import { ctx } from './domain/app-services/impl/ConcreteContext';
import { AuthMiddleware } from './middlewares/AuthMiddleware';

function getVersion(): string {
    const pjson = require('../package.json');
    return pjson.version;
}

function createAuthenticationService(): TokensRegistry {
    const entries = Object.entries({
        'kdarkbyte': { username: 'darkbyte', role: 'user' },
        'kjohn':     { username: 'john',     role: 'user' },
        'kdaddy':    { username: 'daddy',    role: 'user' },
        'kmummy':    { username: 'mummy',    role: 'user' },
        'kmoo':      { username: 'moo',      role: 'user' },
    });

    return new FakeAuthenticationService(new Map(entries));
}

console.log(`Starting v${getVersion()}`);

const authService = createAuthenticationService();
const context = ctx;

const ms = new Microservice(config);
ms.useMiddleware(AuthMiddleware(authService, ctx));

ms.run()
    .then(() => console.info('Goodbye!'));
