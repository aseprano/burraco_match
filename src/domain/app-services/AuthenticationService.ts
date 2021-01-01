import { Injectable } from '@darkbyte/herr';

export interface Authentication {
    username: string;
    role: string;
}

@Injectable()
export abstract class AuthenticationService {
    
    public abstract getUsername(key: any): Promise<Authentication>;
    
}