import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, endWith, exhaustMap, forkJoin, map, of, startWith } from 'rxjs';

import { CarriagesService } from '../../admin/services/carriages.service';
import { StationsService } from '../../admin/services/stations.service';
import { Carriage } from '../../core/models';
import { Station } from '../../core/models/station/station.model';
import { MessagesService } from '../../core/services/messages.service';
import { AppCarriagesActions } from '../actions/app-carriages.actions';
import { AppConfigActions } from '../actions/app-config.actions';
import { AppSearchActions } from '../actions/app-search.actions';
import { AppStationsActions } from '../actions/app-station.actions';
import { selectCarriages } from '../selectors/app-carriages.selector';
import { selectStations } from '../selectors/app-stations.selector';

@Injectable()
export class AppSearchEffects {
    private store = inject(Store);

    constructor(
        private actions$: Actions,
        private carriagesService: CarriagesService,
        private stationsService: StationsService,
        private messagesService: MessagesService
    ) {}

    lazyLoadSearchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppSearchActions.loadSearchData),
            concatLatestFrom(() => [this.store.select(selectCarriages), this.store.select(selectStations)]),
            exhaustMap(([, carriagesOld, stationsOld]) => {
                if (carriagesOld?.length > 0 && stationsOld?.length > 0) {
                    return of(AppSearchActions.searchDataLoadNotRequired());
                }
                if (carriagesOld?.length > 0) {
                    return this.stationsService.getStations().pipe(
                        map((stations: Station[]) => {
                            return AppStationsActions.loadStationsSuccess({ stations });
                        }),
                        catchError((error) => of(AppStationsActions.loadStationsFailure({ error }))),
                        startWith(AppConfigActions.setVisibleLoader()),
                        endWith(AppConfigActions.setInvisibleLoader())
                    );
                }
                if (stationsOld?.length > 0) {
                    return this.carriagesService.getCarriages().pipe(
                        map((carriages: Carriage[]) => {
                            return AppCarriagesActions.loadCarriagesSuccess({ carriages });
                        }),
                        catchError((error) => of(AppCarriagesActions.loadCarriagesFailure({ error }))),
                        startWith(AppConfigActions.setVisibleLoader()),
                        endWith(AppConfigActions.setInvisibleLoader())
                    );
                }
                return forkJoin([this.carriagesService.getCarriages(), this.stationsService.getStations()]).pipe(
                    map(([carriages, stations]) => {
                        return AppSearchActions.loadSearchDataSuccess({ stations, carriages });
                    }),
                    catchError((error) => of(AppSearchActions.loadSearchDataFailure({ error }))),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );

    loadSearchDataSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppSearchActions.loadSearchDataSuccess),
            exhaustMap((action) => {
                return of(AppStationsActions.loadStationsSuccess({ stations: action.stations }));
            })
        )
    );
}
