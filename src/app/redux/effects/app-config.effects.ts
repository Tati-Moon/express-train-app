import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { exhaustMap, of } from 'rxjs';

import { AppConfigActions } from '../actions/app-config.actions';
import { AppUserActions } from '../actions/app-user.actions';
import {
    headerMenuAdminInitialState,
    headerMenuGuestInitialState,
    headerMenuUserInitialState,
    sidebarMenuAdminInitialState,
    sidebarMenuGuestInitialState,
    sidebarMenuUserInitialState,
} from '../reducers/initial-state';
import { selectTokenAndIsAdmin } from '../selectors/app-user.selector';

@Injectable()
export class AppConfigEffects {
    private store = inject(Store);
    constructor(private actions$: Actions) {}

    setNewState$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppUserActions.updateUserData, AppUserActions.logOutSuccess),

            concatLatestFrom(() => this.store.select(selectTokenAndIsAdmin)),

            exhaustMap(([, { token, isAdmin }]) => {
                let headerMenu;
                let sidebarMenu;

                if (isAdmin) {
                    headerMenu = headerMenuAdminInitialState;
                    sidebarMenu = sidebarMenuAdminInitialState;
                } else if (token) {
                    headerMenu = headerMenuUserInitialState;
                    sidebarMenu = sidebarMenuUserInitialState;
                } else {
                    headerMenu = headerMenuGuestInitialState;
                    sidebarMenu = sidebarMenuGuestInitialState;
                }

                return of(AppConfigActions.setNewStateHeaderMenu({ headerMenu, sidebarMenu }));
            })
        )
    );
}
