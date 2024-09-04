import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { endWith, exhaustMap, map, of, startWith, tap } from 'rxjs';

import { AuthService } from '../../auth/services/auth-service.service';
import { LocalStorageFields } from '../../core/models/enums/constants';
import { Routers } from '../../core/models/enums/routers';
import { UserRole } from '../../core/models/user/user.model';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { AppConfigActions } from '../actions/app-config.actions';
import { AppUserActions } from '../actions/app-user.actions';
import { selectToken } from '../selectors/app-user.selector';

@Injectable()
export class AppUserEffects {
    private store = inject(Store);
    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private router: Router,
        private localStorageService: LocalStorageService
    ) {}

    logIn$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppUserActions.logIn, AppUserActions.postLoadUserData),

            exhaustMap(() => {
                return this.authService.getUserProfile().pipe(
                    map(({ email, name, role }) => {
                        const btoaEmail = btoa(LocalStorageFields.EMAIL as string);
                        const btoaRole = btoa(LocalStorageFields.ROLE as string);

                        this.localStorageService.setItem(btoaEmail, btoa(email));
                        this.localStorageService.setItem(btoaRole, btoa(role));

                        return AppUserActions.updateUserData({ email, name, role: role as UserRole });
                    }),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );

    logOut$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppUserActions.logOut),

            concatLatestFrom(() => this.store.select(selectToken)),

            exhaustMap(([, token]) => {
                return this.authService.logOut(token ?? '').pipe(map(() => AppUserActions.logOutDeleteToken()));
            })
        )
    );

    logOutDeleteToken$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppUserActions.logOutDeleteToken),
            exhaustMap(() => {
                return of(AppUserActions.logOutSuccess());
            })
        )
    );

    redirectToHome$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AppUserActions.logOutSuccess),
                tap(() => {
                    this.router.navigate([Routers.ROOT]);
                })
            ),
        { dispatch: false }
    );
}
