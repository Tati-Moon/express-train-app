import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Schedule, ScheduleRide, Segment } from '../../core/models/schedules/schedule.model';

export const AppSchedulesActions = createActionGroup({
    source: 'APP SCHEDULES',
    events: {
        'Load Schedules': props<{ id: number }>(),
        'Load Schedules Success': props<{ schedulesRide: ScheduleRide }>(),
        'Load Schedules Failure': props<{ error: string }>(),

        'Hide Form Schedule': emptyProps(),

        'Init Create Schedule': emptyProps(),
        'Init Edit Schedule': emptyProps(),

        'Init Save New Schedule': props<{ routeId: number; segments: Segment[] }>(),
        'New Schedule Saved Success': props<{ schedule: Schedule }>(),
        'New Schedule Saved Failure': props<{ error: string }>(),

        'Init Update Schedule': props<{ routeId: number; rideId: number; segments: Segment[] }>(),
        'Update Schedule Success': props<{ segments: Segment[]; rideId: number }>(),
        'Update Schedule Failure': props<{ error: string }>(),

        'Init Delete Schedule': props<{ routeId: number; rideId: number }>(),
        'Delete Schedule Success': props<{ rideId: number }>(),
        'Delete Schedule Failure': props<{ error: string }>(),
    },
});
