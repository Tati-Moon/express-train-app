import { createReducer, on } from '@ngrx/store';

import { AppConfigActions } from '../actions/app-config.actions';
import { AppConfigState } from '../models/app-config-state.model';
import { AppConfigFields } from '../models/state-fields';
import { headerMenuGuestInitialState, sidebarMenuGuestInitialState } from './initial-state';

export const initialState: AppConfigState = {
    [AppConfigFields.SIDEBAR_MENU]: sidebarMenuGuestInitialState,
    [AppConfigFields.HEADER_MENU]: headerMenuGuestInitialState,
    [AppConfigFields.SHOW_LOADER]: false,
};

export const appConfigReducer = createReducer(
    initialState,
    on(
        AppConfigActions.setNewStateHeaderMenu,
        (state, { headerMenu, sidebarMenu }): AppConfigState => ({
            ...state,
            [AppConfigFields.HEADER_MENU]: headerMenu,
            [AppConfigFields.SIDEBAR_MENU]: sidebarMenu,
        })
    ),
    on(
        AppConfigActions.setVisibleLoader,
        (state): AppConfigState => ({
            ...state,
            [AppConfigFields.SHOW_LOADER]: true,
        })
    ),
    on(
        AppConfigActions.setInvisibleLoader,
        (state): AppConfigState => ({
            ...state,
            [AppConfigFields.SHOW_LOADER]: false,
        })
    )
);
