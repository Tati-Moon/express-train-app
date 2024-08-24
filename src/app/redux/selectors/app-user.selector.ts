import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppUserState, UserRole } from '../models/app-user-state.model';
import { AppUserFields, StateFields } from '../models/state-fields';

export const selectAppUser = createFeatureSelector<AppUserState>(StateFields.APP_USER);

export const selectToken = createSelector(selectAppUser, (state: AppUserState) => state[AppUserFields.USER_TOKEN]);
export const selectUserRole = createSelector(selectAppUser, (state: AppUserState) => state[AppUserFields.USER_ROLE]);
export const selectIsAdmin = createSelector(
    selectAppUser,
    (state: AppUserState) => state[AppUserFields.USER_ROLE] === UserRole.MANAGER
);
export const selectTokenAndIsAdmin = createSelector(selectToken, selectIsAdmin, (token, isAdmin) => ({
    token,
    isAdmin,
}));
