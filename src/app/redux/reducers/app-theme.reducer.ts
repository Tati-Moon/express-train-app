import { createReducer, on } from '@ngrx/store';

import { Schemes, Themes } from '../../core/models/enums/constants';
import { AppThemeActions } from '../actions/app-theme.actions';
import { AppThemeState } from '../models/app-theme-state.model';
import { AppThemeFields } from '../models/state-fields';

export const initialState: AppThemeState = {
    [AppThemeFields.COLOR_SCHEME]: Schemes.LIGHT,
    [AppThemeFields.THEME]: Themes.LARA_LIGHT_INDIGO,
};

export const appThemeReducer = createReducer(
    initialState,
    on(
        AppThemeActions.setColorScheme,
        (state, { colorScheme, theme }): AppThemeState => ({
            ...state,
            [AppThemeFields.COLOR_SCHEME]: colorScheme,
            [AppThemeFields.THEME]: theme,
        })
    )
);
