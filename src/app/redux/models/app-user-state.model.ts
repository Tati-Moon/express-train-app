import { UserRole } from '../../core/models/user/user.model';
import { AppUserFields } from './state-fields';

export interface AppUserState {
    [AppUserFields.USER_EMAIL]: string | null;
    [AppUserFields.USER_NAME]: string | null;
    [AppUserFields.USER_TOKEN]: string | null;
    [AppUserFields.USER_ROLE]: UserRole | null;
}
