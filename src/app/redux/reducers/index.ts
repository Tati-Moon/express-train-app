import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { AppAdminState } from '../models/app-admin-state.model';
import { AppCarriagesState } from '../models/app-carriages-state.model';
import { AppConfigState } from '../models/app-config-state.model';
import { AppLanguageState } from '../models/app-language-state.model';
import { AppThemeState } from '../models/app-theme-state.model';
import { AppUserState } from '../models/app-user-state.model';
import { StateFields } from '../models/state-fields';
import { appAdminReducer } from './app-admin.reducer';
import { appCarriagesReducer } from './app-carriages.reducer';
import { appConfigReducer } from './app-config.reducer';
import { appLanguageReducer } from './app-language.reducer';
import { appThemeReducer } from './app-theme.reducer';
import { appUserReducer } from './app-user.reducer';

export interface State {
    [StateFields.APP_CONFIG_GENERAL]: AppConfigState;
    [StateFields.APP_CONFIG_LANGUAGE]: AppLanguageState;
    [StateFields.APP_CONFIG_THEME]: AppThemeState;
    [StateFields.APP_CONFIG_ADMIN]: AppAdminState;
    [StateFields.APP_CARRIAGES]: AppCarriagesState;
    [StateFields.APP_USER]: AppUserState;
}

export const reducers: ActionReducerMap<State> = {
    [StateFields.APP_CONFIG_GENERAL]: appConfigReducer,
    [StateFields.APP_CONFIG_LANGUAGE]: appLanguageReducer,
    [StateFields.APP_CONFIG_THEME]: appThemeReducer,
    [StateFields.APP_CONFIG_ADMIN]: appAdminReducer,
    [StateFields.APP_CARRIAGES]: appCarriagesReducer,
    [StateFields.APP_USER]: appUserReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
