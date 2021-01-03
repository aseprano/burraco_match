import { RequestHandler } from 'express';
import { AuthenticationService } from '../domain/app-services/AuthenticationService';
import { ConcreteContext } from '../domain/app-services/impl/ConcreteContext';

export function AuthMiddleware(authorizationService: AuthenticationService, ctx: ConcreteContext): RequestHandler {
    return async (req, res, next) => {
        const authorizationHeader = req.headers.authorization;
    
        if (typeof authorizationHeader !== 'string' || !authorizationHeader.startsWith('Bearer ')) {
            res.sendStatus(401); // SBAM! Unauthorized!!!
            return;
        }
    
        const bearerToken = authorizationHeader.split(' ').slice(1).join(' ');
        const userData = await authorizationService.getUsername(bearerToken);
    
        if (!userData) {
            res.sendStatus(401); // SBAM! Unauthorized!!!
        } else {
            ctx.bind(req, userData);
            console.debug(`Going next`);
            next();
        }
    }
}
