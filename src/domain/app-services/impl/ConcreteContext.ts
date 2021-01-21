import { Context, ContextData } from '../Context';
import { Request } from 'express';

const EmptyContextData: ContextData = Object.freeze({
    user: undefined,
});

class ConcreteContext extends Context {
    private readonly bindings = new WeakMap<Request, ContextData>();

    public bind(req: Request, data: ContextData) {
        this.bindings.set(req, data);
    }

    public getForRequest(req: Request): ContextData {
        return this.bindings.get(req) || EmptyContextData;
    }
}

const ctx = new ConcreteContext();

export { ConcreteContext, ctx };
