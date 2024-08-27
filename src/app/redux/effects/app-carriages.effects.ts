import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, endWith, exhaustMap, map, of, startWith } from 'rxjs';

import { CarriageCreateFormService } from '../../admin/services/carriage-create-form.service';
import { CarriagesService } from '../../admin/services/carriages.service';
import { Carriage } from '../../core/models';
import { MessagesService } from '../../core/services/messages.service';
import { AppCarriagesActions } from '../actions/app-carriages.actions';
import { AppConfigActions } from '../actions/app-config.actions';
import { AppRoutesActions } from '../actions/app-routes.actions';

@Injectable()
export class AppCarriagesEffects {
    private store = inject(Store);
    private get form() {
        return this.carriageFormService.carriageCreateForm;
    }

    constructor(
        private actions$: Actions,
        private carriagesService: CarriagesService,
        private messagesService: MessagesService,
        private carriageFormService: CarriageCreateFormService
    ) {}

    loadCarriages$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppCarriagesActions.loadCarriages, AppRoutesActions.loadRoutesSuccess),
            exhaustMap(() => {
                return this.carriagesService.getCarriages().pipe(
                    map((carriages: Carriage[]) => {
                        this.form.reset();
                        return AppCarriagesActions.loadCarriagesSuccess({ carriages });
                    }),
                    catchError((error) => of(AppCarriagesActions.loadCarriagesFailure({ error }))),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );

    saveCarriage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppCarriagesActions.initSaveNewCarriage),
            exhaustMap((action) => {
                return this.carriagesService.postCarriage(action.carriage).pipe(
                    map((response) => {
                        this.form.reset();
                        this.messagesService.sendSuccess('MESSAGES.CARRIAGES.SAVE_SUCCESS');
                        return AppCarriagesActions.newCarriageSavedSuccess({
                            carriage: { ...action.carriage, code: response.code },
                        });
                    }),
                    catchError((error) => {
                        return of(AppCarriagesActions.newCarriageSavedFailure({ error }));
                    }),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );

    updateCarriage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppCarriagesActions.initUpdateCarriage),
            exhaustMap((action) => {
                return this.carriagesService.putCarriage(action.carriage).pipe(
                    map(() => {
                        this.form.reset();
                        this.messagesService.sendSuccess('MESSAGES.CARRIAGES.UPDATE_SUCCESS');
                        return AppCarriagesActions.updateCarriageSuccess({ carriage: action.carriage });
                    }),
                    catchError((error) => {
                        return of(AppCarriagesActions.updateCarriageFailure({ error }));
                    }),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );
}
