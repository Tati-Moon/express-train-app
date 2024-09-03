import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, endWith, exhaustMap, map, of, startWith } from 'rxjs';

import { MessagesService } from '../../core/services/messages.service';
import { Trip } from '../../home/models';
import { TripService } from '../../home/services/trip.service';
import { AppConfigActions } from '../actions/app-config.actions';
import { AppTripActions } from '../actions/app-trip.actions';

@Injectable()
export class AppTripEffects {
    constructor(
        private actions$: Actions,
        private tripService: TripService,
        private messagesService: MessagesService
    ) {}

    loadTrip$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppTripActions.loadTripInfo, AppTripActions.orderingSeatSuccess),
            exhaustMap(({ rideId, from, to }) => {
                return this.tripService.getRideInformation(rideId).pipe(
                    map((trip: Trip) => {
                        return AppTripActions.loadTripInfoSuccess({ trip, from, to });
                    }),
                    catchError((error) => of(AppTripActions.loadTripInfoFailure({ error }))),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );

    orderingSeat$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppTripActions.orderingSeat),
            exhaustMap(({ rideId, seat, from, to }) => {
                return this.tripService.postOrder({ rideId, seat, stationStart: from, stationEnd: to }).pipe(
                    map(() => {
                        this.messagesService.sendSuccess('MESSAGES.TRIP.BOOK_SUCCESS');
                        return AppTripActions.orderingSeatSuccess({ rideId, from, to });
                    }),
                    catchError((error) => of(AppTripActions.orderingSeatFailure({ error }))),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );
}
