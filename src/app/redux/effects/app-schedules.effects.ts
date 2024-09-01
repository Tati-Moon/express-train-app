import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, endWith, exhaustMap, map, of, startWith } from 'rxjs';

import { SchedulesService } from '../../admin/services/schedules.service';
import { StationsService } from '../../admin/services/stations.service';
import { ScheduleRide } from '../../core/models/schedules/schedule.model';
import { MessagesService } from '../../core/services/messages.service';
import { AppConfigActions } from '../actions/app-config.actions';
import { AppSchedulesActions } from '../actions/app-schedule.actions';

@Injectable()
export class AppSchedulesEffects {
    private store = inject(Store);
    private get form() {
        return this.schedulesService.scheduleCreateForm;
    }

    constructor(
        private actions$: Actions,
        private schedulesService: SchedulesService,
        private stationsService: StationsService,
        private messagesService: MessagesService
    ) {}

    loadSchedules$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppSchedulesActions.loadSchedules),
            exhaustMap((action) => {
                return this.schedulesService.getRouteSchedule(action.id).pipe(
                    map((schedulesRide: ScheduleRide) => {
                        this.form.reset();
                        return AppSchedulesActions.loadSchedulesSuccess({ schedulesRide });
                    }),
                    catchError((error) => of(AppSchedulesActions.loadSchedulesFailure({ error }))),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );

    saveSchedule$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppSchedulesActions.initSaveNewSchedule),
            exhaustMap((action) => {
                return this.schedulesService.createRide(action.routeId, action.segments).pipe(
                    map(({ id }) => {
                        this.form.reset();
                        this.messagesService.sendSuccess('MESSAGES.SCHEDULES.SAVE_SUCCESS');
                        return AppSchedulesActions.newScheduleSavedSuccess({
                            schedule: { rideId: id, segments: action.segments },
                        });
                    }),
                    catchError((error) => {
                        return of(AppSchedulesActions.newScheduleSavedFailure({ error }));
                    }),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );

    updateSchedule$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppSchedulesActions.initUpdateSchedule),
            exhaustMap((action) => {
                return this.schedulesService.updateRide(action.routeId, action.rideId, action.segments).pipe(
                    map(() => {
                        this.messagesService.sendSuccess('MESSAGES.SCHEDULES.UPDATE_SUCCESS');
                        return AppSchedulesActions.updateScheduleSuccess({
                            segments: action.segments,
                            rideId: action.rideId,
                        });
                    }),
                    catchError((error) => {
                        return of(AppSchedulesActions.updateScheduleFailure({ error }));
                    }),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );

    deleteSchedule$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppSchedulesActions.initDeleteSchedule),
            exhaustMap((action) => {
                return this.schedulesService.deleteRide(action.routeId, action.rideId).pipe(
                    map(() => {
                        this.messagesService.sendSuccess('MESSAGES.SCHEDULES.DELETE_SUCCESS');
                        return AppSchedulesActions.deleteScheduleSuccess({
                            rideId: action.rideId,
                        });
                    }),
                    catchError((error) => {
                        return of(AppSchedulesActions.deleteScheduleFailure({ error }));
                    }),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );
}
