import { Injectable } from '@darkbyte/herr';
import { Authentication } from './AuthenticationService';

@Injectable()
export abstract class Context {

    public abstract get(request: Request): Authentication;

}