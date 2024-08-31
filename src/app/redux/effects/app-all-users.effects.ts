import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, endWith, exhaustMap, map, of, startWith } from 'rxjs';

import { User } from '../../core/models/user/user.model';
import { UserService } from '../../user-profile/services/user.service';
import { AppAllUsersActions } from '../actions/app-all-users.actions';
import { AppConfigActions } from '../actions/app-config.actions';
import { AppOrdersActions } from '../actions/app-orders.actions';

@Injectable()
export class AppAllUsersEffects {
    constructor(
        private actions$: Actions,

        private userService: UserService
    ) {}

    loadSchedules$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppOrdersActions.loadOrdersSuccess),
            exhaustMap(() => {
                return this.userService.getUsers().pipe(
                    map((allUsers: User[]) => {
                        return AppAllUsersActions.loadAllUsersSuccess({ allUsers });
                    }),
                    catchError((error) => of(AppOrdersActions.loadOrdersFailure({ error }))),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );
}
