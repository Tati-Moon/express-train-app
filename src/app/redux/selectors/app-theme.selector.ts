import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppThemeState } from '../models/app-theme-state.model';
import { AppThemeFields, StateFields } from '../models/state-fields';

export const selectThemeConfig = createFeatureSelector<AppThemeState>(StateFields.APP_CONFIG_THEME);

export const selectColorScheme = createSelector(
    selectThemeConfig,
    (state: AppThemeState) => state[AppThemeFields.COLOR_SCHEME]
);
export const selectTheme = createSelector(selectThemeConfig, (state: AppThemeState) => state[AppThemeFields.THEME]);
