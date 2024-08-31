export enum UserRole {
    USER = 'user',
    MANAGER = 'manager',
}

export interface User {
    id: number;
    email: string;
    name: string;
    role: UserRole;
}
