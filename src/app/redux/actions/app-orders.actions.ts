import { createActionGroup, props } from '@ngrx/store';

import { Order } from '../../core/models/orders/orders.model';

export const AppOrdersActions = createActionGroup({
    source: 'APP ORDERS',
    events: {
        'Load Orders': props<{ all: boolean }>(),
        'Load Orders Success': props<{ orders: Order[] }>(),
        'Load Orders Failure': props<{ error: string }>(),

        'Init Cancel Order': props<{ orderId: number }>(),
        'Cancel Order Success': props<{ orderId: number }>(),
        'Cancel Order Failure': props<{ error: string }>(),
    },
});
