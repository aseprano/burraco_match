import { Injectable, } from '@darkbyte/herr';
import { UserData } from './TokensRegistry';
import { Request } from 'express';

export interface ContextData {
    user?: UserData;
}

@Injectable()
export abstract class Context {

    public abstract getForRequest(request: Request): ContextData;

}