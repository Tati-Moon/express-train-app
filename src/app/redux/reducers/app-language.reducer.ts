import { createReducer, on } from '@ngrx/store';

import { Languages } from '../../core/enums/constants';
import { AppLanguageActions } from '../actions/app-language.actions';
import { AppLanguageState } from '../models/app-language-state.model';
import { AppLanguageFields } from '../models/state-fields';

export const initialState: AppLanguageState = {
    [AppLanguageFields.DEFAULT_LANGUAGE]: Languages.EN,
};

export const appLanguageReducer = createReducer(
    initialState,
    on(
        AppLanguageActions.setNewApplicationLanguage,
        (state, { language }): AppLanguageState => ({
            ...state,
            [AppLanguageFields.DEFAULT_LANGUAGE]: language,
        })
    )
);
