import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppCarriagesState } from '../models/app-carriages-state.model';
import { AppCarriageFields, StateFields } from '../models/state-fields';

export const selectAppCarriages = createFeatureSelector<AppCarriagesState>(StateFields.APP_CARRIAGES);

export const selectCarriages = createSelector(
    selectAppCarriages,
    (state: AppCarriagesState) => state[AppCarriageFields.CARRIAGES]
);

export const selectShowFormState = createSelector(
    selectAppCarriages,
    (state: AppCarriagesState) => state[AppCarriageFields.SHOW_CARRIAGE_FORM]
);

export const selectFormMode = createSelector(
    selectAppCarriages,
    (state: AppCarriagesState) => state[AppCarriageFields.CARRIAGE_FORM_MODE]
);
