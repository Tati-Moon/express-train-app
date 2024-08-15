import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { AppLanguageState } from '../models/app-language-state.model';
import { StateFields } from '../models/state-fields';
import { appLanguageReducer } from './app-language.reducer';

export interface State {
    [StateFields.APP_CONFIG_LANGUAGE]: AppLanguageState;
}

export const reducers: ActionReducerMap<State> = {
    [StateFields.APP_CONFIG_LANGUAGE]: appLanguageReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
