import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, endWith, exhaustMap, map, of, startWith } from 'rxjs';

import { CarriagesService } from '../../admin/services/carriages.service';
import { Carriage } from '../../core/models';
import { MessagesService } from '../../core/services/messages.service';
import { AppCarriagesActions } from '../actions/app-carriages.actions';
import { AppConfigActions } from '../actions/app-config.actions';

@Injectable()
export class AppCarriagesEffects {
    private store = inject(Store);
    constructor(
        private actions$: Actions,
        private carriagesService: CarriagesService,
        private messagesService: MessagesService
    ) {}

    loadCarriages$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppCarriagesActions.loadCarriages),
            exhaustMap(() => {
                return this.carriagesService.getCarriages().pipe(
                    map((carriages: Carriage[]) => {
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
                    map(() => {
                        this.messagesService.sendSuccess('MESSAGES.CARRIAGES.SAVE_SUCCESS');
                        return AppCarriagesActions.newCarriageSavedSuccess({ carriage: action.carriage });
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
}
