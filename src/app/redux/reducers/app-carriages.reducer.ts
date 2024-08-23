import { createReducer, on } from '@ngrx/store';

import { AppCarriagesActions } from '../actions/app-carriages.actions';
import { AppCarriagesState } from '../models/app-carriages-state.model';
import { AppCarriageFields } from '../models/state-fields';

export const initialState: AppCarriagesState = {
    [AppCarriageFields.CARRIAGES]: [],
    [AppCarriageFields.SHOW_CARRIAGE_FORM]: false,
    [AppCarriageFields.CARRIAGE_FORM_MODE]: null,
};

export const appCarriagesReducer = createReducer(
    initialState,
    on(
        AppCarriagesActions.initCreateCarriage,
        (state): AppCarriagesState => ({
            ...state,
            [AppCarriageFields.SHOW_CARRIAGE_FORM]: true,
            [AppCarriageFields.CARRIAGE_FORM_MODE]: 'CREATE',
        })
    ),
    on(
        AppCarriagesActions.hideFormCarriage,
        (state): AppCarriagesState => ({
            ...state,
            [AppCarriageFields.SHOW_CARRIAGE_FORM]: false,
            [AppCarriageFields.CARRIAGE_FORM_MODE]: null,
        })
    ),
    on(
        AppCarriagesActions.newCarriageSavedSuccess,
        (state, { carriage }): AppCarriagesState => ({
            ...state,
            [AppCarriageFields.CARRIAGES]: [...state[AppCarriageFields.CARRIAGES], carriage],
            [AppCarriageFields.SHOW_CARRIAGE_FORM]: false,
            [AppCarriageFields.CARRIAGE_FORM_MODE]: null,
        })
    ),
    on(
        AppCarriagesActions.loadCarriagesSuccess,
        (state, { carriages }): AppCarriagesState => ({
            ...state,
            [AppCarriageFields.CARRIAGES]: carriages,
        })
    ),
    on(
        AppCarriagesActions.initEditCarriage,
        (state): AppCarriagesState => ({
            ...state,
            [AppCarriageFields.SHOW_CARRIAGE_FORM]: true,
            [AppCarriageFields.CARRIAGE_FORM_MODE]: 'EDIT',
        })
    ),
    on(
        AppCarriagesActions.updateCarriageSuccess,
        (state, { carriage }): AppCarriagesState => ({
            ...state,
            [AppCarriageFields.SHOW_CARRIAGE_FORM]: false,
            [AppCarriageFields.CARRIAGE_FORM_MODE]: null,
            [AppCarriageFields.CARRIAGES]: state[AppCarriageFields.CARRIAGES].map((item) =>
                item.code === carriage.code ? carriage : item
            ),
        })
    )
);
