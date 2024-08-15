import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppLanguageState } from '../models/app-language-state.model';
import { AppLanguageFields, StateFields } from '../models/state-fields';

export const selectLanguageConfig = createFeatureSelector<AppLanguageState>(StateFields.APP_CONFIG_LANGUAGE);

export const selectDefaultLanguage = createSelector(
    selectLanguageConfig,
    (state: AppLanguageState) => state[AppLanguageFields.DEFAULT_LANGUAGE]
);

export const selectLanguageMenuInit = createSelector(
    selectLanguageConfig,
    (state: AppLanguageState) => state[AppLanguageFields.LANGUAGE_MENU]
);

export const selectLanguageMenuShow = createSelector(
    selectLanguageConfig,
    (state: AppLanguageState) => state[AppLanguageFields.LANGUAGE_MENU_OPEN]
);
