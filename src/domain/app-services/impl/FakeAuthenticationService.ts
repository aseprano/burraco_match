import { Authentication, AuthenticationService } from '../AuthenticationService';

export class FakeAuthenticationService implements AuthenticationService {

    constructor(
        private readonly users: Map<string, Authentication>) {
    }

    public async getUsername(key: any): Promise<Authentication> {
        if (!this.users.has(key)) {
            throw new Error(`User not found: ${key}`);
        }

        return this.users.get(key)!;
    }

}