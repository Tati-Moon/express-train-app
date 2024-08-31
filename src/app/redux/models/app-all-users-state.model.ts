import { User } from '../../core/models/user/user.model';
import { AppAllUsersFields } from './state-fields';

export interface AppAllUsersState {
    [AppAllUsersFields.ALL_USERS]: User[];
}
