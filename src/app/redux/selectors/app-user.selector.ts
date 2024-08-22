import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppUserState } from '../models/app-user-state.model';
import { AppUserFields, StateFields } from '../models/state-fields';

export const selectAppUser = createFeatureSelector<AppUserState>(StateFields.APP_USER);

export const selectToken = createSelector(selectAppUser, (state: AppUserState) => state[AppUserFields.USER_TOKEN]);
