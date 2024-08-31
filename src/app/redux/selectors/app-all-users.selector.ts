import { createFeatureSelector, createSelector } from '@ngrx/store';

import { User } from '../../core/models/user/user.model';
import { AppAllUsersState } from '../models/app-all-users-state.model';
import { AppAllUsersFields, StateFields } from '../models/state-fields';

export const selectAppAllUsers = createFeatureSelector<AppAllUsersState>(StateFields.APP_ALL_USERS);

export const selectAllUsers = createSelector(
    selectAppAllUsers,
    (state: AppAllUsersState) => state[AppAllUsersFields.ALL_USERS]
);

export const selectUserById = (userId: number) =>
    createSelector(selectAllUsers, (users: User[]) => users.find((user) => user.id === userId) || null);
