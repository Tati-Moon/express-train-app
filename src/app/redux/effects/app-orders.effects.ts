import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, endWith, exhaustMap, map, of, startWith } from 'rxjs';

import { Order } from '../../core/models/orders/orders.model';
import { MessagesService } from '../../core/services/messages.service';
import { OrdersService } from '../../user-profile/services/orders.service';
import { AppConfigActions } from '../actions/app-config.actions';
import { AppOrdersActions } from '../actions/app-orders.actions';

@Injectable()
export class AppOrdersEffects {
    private store = inject(Store);

    constructor(
        private actions$: Actions,
        private ordersService: OrdersService,
        private messagesService: MessagesService
    ) {}

    loadOrders = createEffect(() =>
        this.actions$.pipe(
            ofType(AppOrdersActions.loadOrders),
            exhaustMap((action) => {
                return this.ordersService.getOrders(action.all).pipe(
                    map((orders: Order[]) => {
                        return AppOrdersActions.loadOrdersSuccess({ orders });
                    }),
                    catchError((error) => of(AppOrdersActions.loadOrdersFailure({ error }))),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );

    deleteOrder$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppOrdersActions.initCancelOrder),
            exhaustMap((action) => {
                return this.ordersService.deleteOrder(action.orderId).pipe(
                    map(() => {
                        this.messagesService.sendSuccess('MESSAGES.ORDERS.CANCEL_SUCCESS');
                        return AppOrdersActions.cancelOrderSuccess({
                            orderId: action.orderId,
                        });
                    }),
                    catchError((error) => {
                        return of(AppOrdersActions.cancelOrderFailure({ error }));
                    }),
                    startWith(AppConfigActions.setVisibleLoader()),
                    endWith(AppConfigActions.setInvisibleLoader())
                );
            })
        )
    );
}
