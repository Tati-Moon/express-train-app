import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppSchedulesState } from '../models/app-schedule-state.model';
import { AppScheduleFields, StateFields } from '../models/state-fields';

export const selectAppSchedules = createFeatureSelector<AppSchedulesState>(StateFields.APP_SCHEDULES);

export const selectSchedule = createSelector(
    selectAppSchedules,
    (state: AppSchedulesState) => state[AppScheduleFields.SCHEDULES]
);
export const selectScheduleRide = createSelector(
    selectAppSchedules,
    (state: AppSchedulesState) => state[AppScheduleFields.SCHEDULES_RIDE]
);

export const selectShowSchedulesFormState = createSelector(
    selectAppSchedules,
    (state: AppSchedulesState) => state[AppScheduleFields.SHOW_SCHEDULE_FORM]
);

export const selectSchedulesFormMode = createSelector(
    selectAppSchedules,
    (state: AppSchedulesState) => state[AppScheduleFields.SCHEDULE_FORM_MODE]
);
