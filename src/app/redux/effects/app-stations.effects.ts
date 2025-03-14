import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, endWith, exhaustMap, map, of, startWith } from 'rxjs';

import { StationsService } from '../../admin/services/stations.service';
import { Station } from '../../core/models/station/station.model';
import { MessagesService } from '../../core/services/messages.service';
import { AppConfigActions } from '../actions/app-config.actions';
import { AppOrdersActions } from '../actions/app-orders.actions';
import { AppRoutesActions } from '../actions/app-routes.actions';
import { AppSchedulesActions } from '../actions/app-schedule.actions';
import { AppStationsActions } from '../actions/app-station.actions';
import { AppTripActions } from '../actions/app-trip.actions';
import { selectIsStationInActiveRide, selectStations } from '../selectors/app-stations.selector';

@Injectable()
export class AppStationsEffects {
    private store = inject(Store);
    private get form() {
        return this.stationsService.stationCreateForm;
    }

    constructor(
        private actions$: Actions,
        private stationsService: StationsService,
        private messagesService: MessagesService
    ) {}

    loadStations$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppStationsActions.loadStations, AppStationsActions.deleteStationSuccess),
            exhaustMap(() => {
                return this.stationsService.getStations().pipe(
                    map((stations: Station[]) => {
                        this.form.reset();
                        return AppStationsActions.loadStationsSuccess({ stations });
                    }),
                    catchError((error) => of(AppStationsActions.loadStationsFailure({ error }))),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );
    lazyLoadStations$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                AppStationsActions.lazyLoadStations,
                AppRoutesActions.loadRoutesSuccess,
                AppSchedulesActions.loadSchedulesSuccess,
                AppOrdersActions.loadOrdersSuccess,
                AppTripActions.loadTripInfoSuccess
            ),
            concatLatestFrom(() => this.store.select(selectStations)),
            exhaustMap(([, stationsOld]) => {
                if (stationsOld && stationsOld.length > 0) {
                    return of(AppStationsActions.stationsLoadNotRequired());
                }
                return this.stationsService.getStations().pipe(
                    map((stations: Station[]) => {
                        this.form.reset();
                        return AppStationsActions.loadStationsSuccess({ stations });
                    }),
                    catchError((error) => of(AppStationsActions.loadStationsFailure({ error }))),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );

    saveStation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppStationsActions.initSaveNewStation),
            exhaustMap((action) => {
                return this.stationsService.postStation(action.station).pipe(
                    map(({ id }) => {
                        this.form.reset();
                        this.messagesService.sendSuccess('MESSAGES.STATIONS.SAVE_SUCCESS');
                        return AppStationsActions.newStationSavedSuccess({ station: { ...action.station, id } });
                    }),
                    catchError((error) => {
                        return of(AppStationsActions.newStationSavedFailure({ error }));
                    }),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );

    updateStation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppStationsActions.initUpdateStation),
            exhaustMap((action) => {
                return this.stationsService.putStation(action.station).pipe(
                    map(() => {
                        this.messagesService.sendSuccess('MESSAGES.STATIONS.UPDATE_SUCCESS');
                        return AppStationsActions.updateStationSuccess({ station: action.station });
                    }),
                    catchError((error) => {
                        return of(AppStationsActions.updateStationFailure({ error }));
                    }),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );

    deleteOrder$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppStationsActions.initDeleteStation),
            concatLatestFrom((action) => this.store.select(selectIsStationInActiveRide(action.id))),
            exhaustMap(([action, isStationInActiveRide]) => {
                if (isStationInActiveRide) {
                    this.messagesService.sendError('MESSAGES.STATIONS.DELETE_STATION_IN_ACTIVE_RIDE');
                    return of(
                        AppOrdersActions.cancelOrderFailure({
                            error: 'MESSAGES.STATIONS.DELETE_STATION_IN_ACTIVE_RIDE',
                        })
                    );
                }
                return this.stationsService.deleteStation(action.id).pipe(
                    map(() => {
                        this.messagesService.sendSuccess('MESSAGES.STATIONS.DELETE_SUCCESS');
                        return AppStationsActions.deleteStationSuccess({ id: action.id });
                    }),
                    catchError((error) => {
                        return of(AppStationsActions.deleteStationFailure({ error }));
                    }),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );
}
