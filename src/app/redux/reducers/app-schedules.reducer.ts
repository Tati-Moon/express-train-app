import { createReducer, on } from '@ngrx/store';

import { AppSchedulesActions } from '../actions/app-schedule.actions';
import { AppSchedulesState } from '../models/app-schedule-state.model';
import { AppScheduleFields } from '../models/state-fields';

export const initialState: AppSchedulesState = {
    [AppScheduleFields.SCHEDULES]: [],
    [AppScheduleFields.SHOW_SCHEDULE_FORM]: false,
    [AppScheduleFields.SCHEDULE_FORM_MODE]: null,
    [AppScheduleFields.SCHEDULES_RIDE]: null,
};

export const appSchedulesReducer = createReducer(
    initialState,
    on(
        AppSchedulesActions.initCreateSchedule,
        (state): AppSchedulesState => ({
            ...state,
            [AppScheduleFields.SHOW_SCHEDULE_FORM]: true,
            [AppScheduleFields.SCHEDULE_FORM_MODE]: 'CREATE',
        })
    ),
    on(
        AppSchedulesActions.hideFormSchedule,
        (state): AppSchedulesState => ({
            ...state,
            [AppScheduleFields.SHOW_SCHEDULE_FORM]: false,
            [AppScheduleFields.SCHEDULE_FORM_MODE]: null,
        })
    ),
    on(
        AppSchedulesActions.loadSchedulesSuccess,
        (state, { schedulesRide }): AppSchedulesState => ({
            ...state,
            [AppScheduleFields.SCHEDULES_RIDE]: schedulesRide,
        })
    ),
    on(AppSchedulesActions.newScheduleSavedSuccess, (state, { schedule }): AppSchedulesState => {
        const currentRide = state[AppScheduleFields.SCHEDULES_RIDE];

        if (!currentRide || !currentRide.schedule) {
            return state;
        }

        const updatedRide = {
            ...currentRide,
            schedule: [...currentRide.schedule, schedule],
        };

        return {
            ...state,
            [AppScheduleFields.SCHEDULES_RIDE]: updatedRide,
            [AppScheduleFields.SHOW_SCHEDULE_FORM]: false,
            [AppScheduleFields.SCHEDULE_FORM_MODE]: null,
        };
    }),

    on(AppSchedulesActions.updateScheduleSuccess, (state, { segments, rideId }): AppSchedulesState => {
        const currentRide = state[AppScheduleFields.SCHEDULES_RIDE];

        if (!currentRide || !currentRide.schedule) {
            return state;
        }

        const updatedSchedule = currentRide.schedule.map((scheduleItem) =>
            scheduleItem.rideId === rideId ? { ...scheduleItem, segments } : scheduleItem
        );
        const updatedRide = {
            ...currentRide,
            schedule: updatedSchedule,
        };

        return {
            ...state,
            [AppScheduleFields.SHOW_SCHEDULE_FORM]: false,
            [AppScheduleFields.SCHEDULE_FORM_MODE]: null,
            [AppScheduleFields.SCHEDULES_RIDE]: updatedRide,
        };
    }),
    on(AppSchedulesActions.deleteScheduleSuccess, (state, { rideId }): AppSchedulesState => {
        const currentRide = state[AppScheduleFields.SCHEDULES_RIDE];

        if (!currentRide || !currentRide.schedule) {
            return state;
        }

        const updatedSchedule = currentRide.schedule.filter((scheduleItem) => scheduleItem.rideId !== rideId);
        const updatedRide = {
            ...currentRide,
            schedule: updatedSchedule,
        };

        return {
            ...state,
            [AppScheduleFields.SHOW_SCHEDULE_FORM]: false,
            [AppScheduleFields.SCHEDULE_FORM_MODE]: null,
            [AppScheduleFields.SCHEDULES_RIDE]: updatedRide,
        };
    })
);
