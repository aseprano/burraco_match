export interface Authentication {
    username: string;
    role: string;
}

export interface AuthenticationService {
    
    getUsername(key: any): Promise<Authentication>;
    
}