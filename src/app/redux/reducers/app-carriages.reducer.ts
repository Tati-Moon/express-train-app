import { createReducer, on } from '@ngrx/store';

import { AppCarriagesActions } from '../actions/app-carriages.actions';
import { AppCarriagesState } from '../models/app-carriages-state.model';
import { AppCarriageFields } from '../models/state-fields';

export const initialState: AppCarriagesState = {
    [AppCarriageFields.CARRIAGES]: [],
    [AppCarriageFields.CREATE_CARRIAGE]: false,
};

export const appCarriagesReducer = createReducer(
    initialState,
    on(
        AppCarriagesActions.initCreateCarriage,
        (state): AppCarriagesState => ({
            ...state,
            [AppCarriageFields.CREATE_CARRIAGE]: true,
        })
    ),
    on(
        AppCarriagesActions.discardCreateCarriage,
        (state): AppCarriagesState => ({
            ...state,
            [AppCarriageFields.CREATE_CARRIAGE]: false,
        })
    ),
    on(
        AppCarriagesActions.newCarriageSaved,
        (state, { carriage }): AppCarriagesState => ({
            ...state,
            [AppCarriageFields.CARRIAGES]: [...state[AppCarriageFields.CARRIAGES], carriage],
            [AppCarriageFields.CREATE_CARRIAGE]: false,
        })
    ),
    on(
        AppCarriagesActions.loadCarriagesSuccess,
        (state, { carriages }): AppCarriagesState => ({
            ...state,
            [AppCarriageFields.CARRIAGES]: carriages,
        })
    )
);
