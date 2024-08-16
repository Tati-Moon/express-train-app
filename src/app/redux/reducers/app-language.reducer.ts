import { createReducer, on } from '@ngrx/store';

import { Languages } from '../../core/models/enums/constants';
import { AppLanguageActions } from '../actions/app-language.actions';
import { AppLanguageState } from '../models/app-language-state.model';
import { AppLanguageFields } from '../models/state-fields';
import { languageMenuInitialState } from './initial-state';

export const initialState: AppLanguageState = {
    [AppLanguageFields.DEFAULT_LANGUAGE]: Languages.EN,
    [AppLanguageFields.LANGUAGE_MENU]: languageMenuInitialState,
    [AppLanguageFields.LANGUAGE_MENU_OPEN]: false,
};

export const appLanguageReducer = createReducer(
    initialState,
    on(
        AppLanguageActions.closeLanguageMenu,
        (state): AppLanguageState => ({
            ...state,
            [AppLanguageFields.LANGUAGE_MENU_OPEN]: false,
        })
    ),
    on(
        AppLanguageActions.openLanguageMenu,
        (state): AppLanguageState => ({
            ...state,
            [AppLanguageFields.LANGUAGE_MENU_OPEN]: true,
        })
    ),
    on(
        AppLanguageActions.setNewApplicationLanguage,
        (state, { language }): AppLanguageState => ({
            ...state,
            [AppLanguageFields.DEFAULT_LANGUAGE]: language,
        })
    )
);
