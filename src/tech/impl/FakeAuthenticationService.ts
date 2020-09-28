import { Authentication, AuthenticationService } from "../AuthenticationService";

export class FakeAuthenticationService implements AuthenticationService {

    constructor(private users: {[key: string]: Authentication}) {
    }

    async getUsername(key: any): Promise<Authentication> {
        return this.users[key];
    }

}