import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { exhaustMap, map } from 'rxjs';

import { CarriagesServiceService } from '../../admin/services/carriages-service.service';
import { Carriage } from '../../core/models';
import { AppCarriagesActions } from '../actions/app-carriages.actions';

@Injectable()
export class AppCarriagesEffects {
    private store = inject(Store);
    constructor(
        private actions$: Actions,
        private carriagesService: CarriagesServiceService
    ) {}

    loadCarriages$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppCarriagesActions.loadCarriages),
            exhaustMap(() => {
                return this.carriagesService.getCarriages().pipe(
                    map((carriages: Carriage[]) => {
                        return AppCarriagesActions.loadCarriagesSuccess({ carriages });
                    })
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
                        return AppCarriagesActions.newCarriageSaved({ carriage: action.carriage });
                    })
                );
            })
        )
    );
}
