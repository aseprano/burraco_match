import { Optional } from '@darkbyte/herr';
import { UserData, TokensRegistry } from '../TokensRegistry';

export class FakeAuthenticationService implements TokensRegistry {

    constructor(
        private readonly users: Map<string, UserData>) {
    }

    public async getUserByAuthorizationToken(authorizationToken: string): Promise<Optional<UserData>> {
        if (!this.users.has(authorizationToken)) {
            throw new Error(`Token not found: ${authorizationToken}`);
        }

        return this.users.get(authorizationToken)!;
    }

}