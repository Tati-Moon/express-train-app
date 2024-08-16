import { createReducer, on } from '@ngrx/store';

import { AppConfigActions } from '../actions/app-config.actions';
import { AppConfigState } from '../models/app-config-state.model';
import { AppConfigFields } from '../models/state-fields';
import { sidebarMenuInitialState, userMenuInitialState } from './initial-state';

export const initialState: AppConfigState = {
    [AppConfigFields.SIDEBAR_MENU]: sidebarMenuInitialState,
    [AppConfigFields.USER_MENU]: userMenuInitialState,
    [AppConfigFields.USER_MENU_OPEN]: false,
};

export const appConfigReducer = createReducer(
    initialState,
    on(
        AppConfigActions.closeUserProfileMenu,
        (state): AppConfigState => ({
            ...state,
            [AppConfigFields.USER_MENU_OPEN]: false,
        })
    ),
    on(
        AppConfigActions.openUserProfileMenu,
        (state): AppConfigState => ({
            ...state,
            [AppConfigFields.USER_MENU_OPEN]: true,
        })
    )
);
