export interface UserProfile {
    name: string;
    email: string;
    password: string;
    role: 'Manager' | 'User';
}
