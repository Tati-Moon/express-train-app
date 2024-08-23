import { AppUserFields } from './state-fields';

export enum UserRole {
    USER = 'user',
    MANAGER = 'manager',
}
export interface AppUserState {
    [AppUserFields.USER_EMAIL]: string | null;
    [AppUserFields.USER_NAME]: string | null;
    [AppUserFields.USER_TOKEN]: string | null;
    [AppUserFields.USER_ROLE]: UserRole | null;
}
