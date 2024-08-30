import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Trip } from '../../home/models';

export const AppTripActions = createActionGroup({
    source: 'APP TRIP',
    events: {
        'Load Trip Info': props<{ rideId: number; from: number; to: number }>(),
        'Load Trip Info Success': props<{ trip: Trip; from: number; to: number }>(),
        'Load Trip Info Failure': props<{ error: string }>(),
        'Clear Trip': emptyProps(),
        'Select Seat': props<{
            seatInCarriage: number;
            numberOfCarriage: number;
            seatInTrain: number;
            price: number;
        }>(),
        'Ordering Seat': props<{ seat: number; rideId: number; from: number; to: number }>(),
        'Ordering Seat Success': props<{ rideId: number; from: number; to: number }>(),
        'Ordering Seat Failure': props<{ error: string }>(),
        'Clear Selected Seat': emptyProps(),
    },
});
