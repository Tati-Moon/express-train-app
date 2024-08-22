import { createReducer, on } from '@ngrx/store';

import { AppUserActions } from '../actions/app-user.actions';
import { AppUserState } from '../models/app-user-state.model';
import { AppUserFields } from '../models/state-fields';

export const initialState: AppUserState = {
    [AppUserFields.USER_EMAIL]: null,
    [AppUserFields.USER_NAME]: null,
    [AppUserFields.USER_TOKEN]: null,
    [AppUserFields.USER_ROLE]: null,
};

export const appUserReducer = createReducer(
    initialState,
    on(
        AppUserActions.logIn,
        (state, { email, token }): AppUserState => ({
            ...state,
            [AppUserFields.USER_EMAIL]: email,
            [AppUserFields.USER_TOKEN]: token,
        })
    ),
    on(
        AppUserActions.updateUserData,
        (state, { email, name, role }): AppUserState => ({
            ...state,
            [AppUserFields.USER_EMAIL]: email,
            [AppUserFields.USER_NAME]: name,
            [AppUserFields.USER_ROLE]: role,
        })
    ),
    on(
        AppUserActions.logOutSuccess,
        (): AppUserState => ({
            ...initialState,
        })
    )
);
