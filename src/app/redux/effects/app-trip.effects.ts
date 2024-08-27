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
                        console.log(trip);
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
                        return AppTripActions.orderingSeatSuccess({ rideId, from, to });
                    }),
                    catchError((error) => of(AppTripActions.orderingSeatFailure({ error }))),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );

    // saveStation$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(AppStationsActions.initSaveNewStation),
    //         exhaustMap((action) => {
    //             return this.stationsService.postStation(action.station).pipe(
    //                 map(() => {
    //                     this.form.reset();
    //                     this.messagesService.sendSuccess('MESSAGES.STATIONS.SAVE_SUCCESS');
    //                     return AppStationsActions.newStationSavedSuccess({ station: action.station });
    //                 }),
    //                 catchError((error) => {
    //                     return of(AppStationsActions.newStationSavedFailure({ error }));
    //                 }),
    //                 startWith(AppConfigActions.setVisibleLoader()),
    //                 endWith(AppConfigActions.setInvisibleLoader())
    //             );
    //         })
    //     )
    // );

    // updateStation$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(AppStationsActions.initUpdateStation),
    //         exhaustMap((action) => {
    //             return this.stationsService.putStation(action.station).pipe(
    //                 map(() => {
    //                     this.messagesService.sendSuccess('MESSAGES.STATIONS.UPDATE_SUCCESS');
    //                     return AppStationsActions.updateStationSuccess({ station: action.station });
    //                 }),
    //                 catchError((error) => {
    //                     return of(AppStationsActions.updateStationFailure({ error }));
    //                 }),
    //                 startWith(AppConfigActions.setVisibleLoader()),
    //                 endWith(AppConfigActions.setInvisibleLoader())
    //             );
    //         })
    //     )
    // );

    // deleteStation$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(AppStationsActions.initDeleteStation),
    //         exhaustMap((action) => {
    //             return this.stationsService.deleteStation(action.id).pipe(
    //                 map(() => {
    //                     this.messagesService.sendSuccess('MESSAGES.STATIONS.DELETE_SUCCESS');
    //                     return AppStationsActions.deleteStationSuccess({ id: action.id });
    //                 }),
    //                 catchError((error) => {
    //                     return of(AppStationsActions.deleteStationFailure({ error }));
    //                 }),
    //                 startWith(AppConfigActions.setVisibleLoader()),
    //                 endWith(AppConfigActions.setInvisibleLoader())
    //             );
    //         })
    //     )
    // );
}
