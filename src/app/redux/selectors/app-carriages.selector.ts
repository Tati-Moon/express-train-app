import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppCarriagesState } from '../models/app-carriages-state.model';
import { AppCarriageFields, StateFields } from '../models/state-fields';

export const selectAppCarriages = createFeatureSelector<AppCarriagesState>(StateFields.APP_CARRIAGES);

export const selectCarriages = createSelector(
    selectAppCarriages,
    (state: AppCarriagesState) => state[AppCarriageFields.CARRIAGES]
);

export const selectCreateCarriageState = createSelector(
    selectAppCarriages,
    (state: AppCarriagesState) => state[AppCarriageFields.CREATE_CARRIAGE]
);
