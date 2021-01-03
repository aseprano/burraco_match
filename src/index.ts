import config from './config/config';
import { Microservice } from "@darkbyte/herr";
import { AuthenticationService, Authentication } from './domain/app-services/AuthenticationService';
import { FakeAuthenticationService } from './domain/app-services/impl/FakeAuthenticationService';
import { ctx } from './domain/app-services/impl/ConcreteContext';

async function createAuthenticationService(): Promise<AuthenticationService> {
    const entries = Object.entries({
        'kdarkbyte': { username: 'darkbyte', role: 'user' },
        'kjohn':     { username: 'john',     role: 'user' },
        'kdaddy':    { username: 'daddy',    role: 'user' },
        'kmummy':    { username: 'mummy',    role: 'user' },
        'kmoo':      { username: 'moo',      role: 'user' },
    });

    return new FakeAuthenticationService(new Map(entries);)
}

const ms = new Microservice(config);
const authService = createAuthenticationService();
const context = ctx;

ms.useMiddleware((req, res, next) => {
    
    next();
});

ms.run()
    .then(() => console.info('Goodbye!'));
