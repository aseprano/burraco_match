import { RequestHandler } from 'express';
import { TokensRegistry } from '../domain/app-services/TokensRegistry';
import { ConcreteContext } from '../domain/app-services/impl/ConcreteContext';

export function AuthMiddleware(tokensRegistry: TokensRegistry, ctx: ConcreteContext): RequestHandler {
    return async (req, res, next) => {
        const authorizationHeader = req.headers.authorization;
    
        if (typeof authorizationHeader !== 'string' || !authorizationHeader.startsWith('Bearer ')) {
            res.sendStatus(401); // SBAM! Unauthorized!!!
            return;
        }
    
        const bearerToken = authorizationHeader.split(' ').slice(1).join(' ');
        const userData = await tokensRegistry.getUserByAuthorizationToken(bearerToken);
    
        if (!userData) {
            res.sendStatus(401); // SBAM! Unauthorized!!!
        } else {
            ctx.bind(req, { user: userData });
            console.debug(`Going next`);
            next();
        }
    }
}
