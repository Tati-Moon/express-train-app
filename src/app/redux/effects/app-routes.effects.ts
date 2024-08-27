import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, endWith, exhaustMap, map, of, startWith } from 'rxjs';

import { RoutesService } from '../../admin/services/route.service';
import { Route } from '../../core/models/route/route.model';
import { MessagesService } from '../../core/services/messages.service';
import { AppConfigActions } from '../actions/app-config.actions';
import { AppRoutesActions } from '../actions/app-routes.actions';

@Injectable()
export class AppRoutesEffects {
    private store = inject(Store);
    private get form() {
        return this.routesService.routeCreateForm;
    }

    constructor(
        private actions$: Actions,
        private routesService: RoutesService,
        private messagesService: MessagesService
    ) {}

    loadRoutes$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                AppRoutesActions.loadRoutes,
                AppRoutesActions.newRouteSavedSuccess,
                AppRoutesActions.updateRouteSuccess,
                AppRoutesActions.deleteRouteSuccess
            ),
            exhaustMap(() => {
                return this.routesService.getRoutes().pipe(
                    map((routes: Route[]) => {
                        this.form.reset();
                        return AppRoutesActions.loadRoutesSuccess({ routes });
                    }),
                    catchError((error) => of(AppRoutesActions.loadRoutesFailure({ error }))),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );

    saveRoute$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppRoutesActions.initSaveNewRoute),
            exhaustMap((action) => {
                return this.routesService.createRoute(action.route).pipe(
                    map(() => {
                        this.form.reset();
                        this.messagesService.sendSuccess('MESSAGES.ROUTES.SAVE_SUCCESS');
                        return AppRoutesActions.newRouteSavedSuccess({ route: action.route });
                    }),
                    catchError((error) => {
                        return of(AppRoutesActions.newRouteSavedFailure({ error }));
                    }),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );

    updateRoute$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppRoutesActions.initUpdateRoute),
            exhaustMap((action) => {
                return this.routesService.updateRoute(action.id, action.route).pipe(
                    map(() => {
                        this.messagesService.sendSuccess('MESSAGES.ROUTES.UPDATE_SUCCESS');
                        return AppRoutesActions.updateRouteSuccess({ route: action.route });
                    }),
                    catchError((error) => {
                        return of(AppRoutesActions.updateRouteFailure({ error }));
                    }),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );

    deleteRoute$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppRoutesActions.initDeleteRoute),
            exhaustMap((action) => {
                return this.routesService.deleteRoute(action.id).pipe(
                    map(() => {
                        this.messagesService.sendSuccess('MESSAGES.ROUTES.DELETE_SUCCESS');
                        return AppRoutesActions.deleteRouteSuccess({ id: action.id });
                    }),
                    catchError((error) => {
                        return of(AppRoutesActions.deleteRouteFailure({ error }));
                    }),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );
}
