import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppAdminState } from '../models/app-admin-state.model';
import { AppAdminFields, StateFields } from '../models/state-fields';

export const selectAppAdmin = createFeatureSelector<AppAdminState>(StateFields.APP_CONFIG_ADMIN);

export const selectAdminMenuInit = createSelector(
    selectAppAdmin,
    (state: AppAdminState) => state[AppAdminFields.ADMIN_MENU]
);

export const selectAdminMenuShow = createSelector(
    selectAppAdmin,
    (state: AppAdminState) => state[AppAdminFields.ADMIN_MENU_OPEN]
);

export const selectAdminMenuAvailable = createSelector(
    selectAppAdmin,
    (state: AppAdminState) => state[AppAdminFields.ADMIN_MENU_AVAILABLE]
);
