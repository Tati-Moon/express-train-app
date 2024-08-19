import { createReducer, on } from '@ngrx/store';

import { AppAdminActions } from '../actions/app-admin.actions';
import { AppAdminState } from '../models/app-admin-state.model';
import { AppAdminFields } from '../models/state-fields';
import { headerMenuAdminInitialState } from './initial-state/header-menu';

export const initialState: AppAdminState = {
    [AppAdminFields.ADMIN_MENU]: headerMenuAdminInitialState,
    [AppAdminFields.ADMIN_MENU_OPEN]: false,
    [AppAdminFields.ADMIN_MENU_AVAILABLE]: true,
};

export const appAdminReducer = createReducer(
    initialState,
    on(
        AppAdminActions.closeAdminMenu,
        (state): AppAdminState => ({
            ...state,
            [AppAdminFields.ADMIN_MENU_OPEN]: false,
        })
    ),
    on(
        AppAdminActions.openAdminMenu,
        (state): AppAdminState => ({
            ...state,
            [AppAdminFields.ADMIN_MENU_OPEN]: true,
        })
    ),
    on(
        AppAdminActions.toggleAvailableAdminMenu,
        (state): AppAdminState => ({
            ...state,
            [AppAdminFields.ADMIN_MENU_AVAILABLE]: !state[AppAdminFields.ADMIN_MENU_AVAILABLE],
        })
    )
);
