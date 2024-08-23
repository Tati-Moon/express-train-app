import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { exhaustMap, map, tap } from 'rxjs';

import { AuthService } from '../../auth/services/auth-service.service';
import { AppUserActions } from '../actions/app-user.actions';
import { selectToken } from '../selectors/app-user.selector';

@Injectable()
export class AppUserEffects {
    private store = inject(Store);
    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private router: Router
    ) {}

    logOut$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppUserActions.logOut),

            concatLatestFrom(() => this.store.select(selectToken)),

            exhaustMap(([, token]) => {
                return this.authService.logOut(token ?? '').pipe(
                    map(() => {
                        return AppUserActions.logOutSuccess();
                    })
                );
            })
        )
    );

    redirectToHome$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AppUserActions.logOutSuccess),
                tap(() => {
                    this.router.navigate(['/']);
                })
            ),
        { dispatch: false }
    );
}
