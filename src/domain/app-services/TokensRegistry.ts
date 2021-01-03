import { Injectable, Optional } from '@darkbyte/herr';

export interface UserData {
    username: string;
    role: string;
}

@Injectable()
export abstract class TokensRegistry {
    
    public abstract getUserByAuthorizationToken(authorizationToken: string): Promise<Optional<UserData>>;
    
}