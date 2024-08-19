import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppConfigState } from '../models/app-config-state.model';
import { AppConfigFields, StateFields } from '../models/state-fields';

export const selectAppConfig = createFeatureSelector<AppConfigState>(StateFields.APP_CONFIG_GENERAL);

export const selectSidebarInit = createSelector(
    selectAppConfig,
    (state: AppConfigState) => state[AppConfigFields.SIDEBAR_MENU]
);

export const selectHeaderMenuInit = createSelector(
    selectAppConfig,
    (state: AppConfigState) => state[AppConfigFields.HEADER_MENU]
);

export const selectLoaderState = createSelector(
    selectAppConfig,
    (state: AppConfigState) => state[AppConfigFields.SHOW_LOADER]
);
