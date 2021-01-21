import { Optional } from '@darkbyte/herr';
import { UserData, TokensRegistry } from '../TokensRegistry';

export class FakeAuthenticationService implements TokensRegistry {

    constructor(
        private readonly users: Map<string, UserData>) {
    }

    public async getUserByAuthorizationToken(authorizationToken: string): Promise<Optional<UserData>> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!this.users.has(authorizationToken)) {
                    reject(new Error(`Token not found: ${authorizationToken}`));
                } else {
                    resolve(this.users.get(authorizationToken)!);
                }
            }, 1000);
        })
    }

}