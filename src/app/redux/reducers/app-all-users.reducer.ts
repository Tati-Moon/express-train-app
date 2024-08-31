import { createReducer, on } from '@ngrx/store';

import { AppAllUsersActions } from '../actions/app-all-users.actions';
import { AppAllUsersState } from '../models/app-all-users-state.model';
import { AppAllUsersFields } from '../models/state-fields';

export const initialState: AppAllUsersState = {
    [AppAllUsersFields.ALL_USERS]: [],
};

export const appAllUsersReducer = createReducer(
    initialState,

    on(
        AppAllUsersActions.loadAllUsersSuccess,
        (state, { allUsers }): AppAllUsersState => ({
            ...state,
            [AppAllUsersFields.ALL_USERS]: allUsers,
        })
    )
);
