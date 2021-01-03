import { Injectable } from '@darkbyte/herr';
import { Authentication } from './AuthenticationService';
import { Request } from 'express';

@Injectable()
export abstract class Context {

    public abstract get(request: Request): Authentication;

}