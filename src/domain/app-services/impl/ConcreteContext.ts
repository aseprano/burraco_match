import { Request } from 'express';
import { Authentication } from '../AuthenticationService';

class ConcreteContext {
    private readonly bindings = new WeakMap<Request, Authentication>();

    public bind(req: Request, data: Authentication) {
        this.bindings.set(req, data);
    }

    public get(req: Request): Authentication|undefined {
        return this.bindings.get(req);
    }
}

const ctx = new ConcreteContext();

export { ctx };
