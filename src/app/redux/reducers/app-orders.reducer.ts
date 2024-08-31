import { createReducer, on } from '@ngrx/store';

import { OrderStatus } from '../../core/models/orders/orders.model';
import { AppOrdersActions } from '../actions/app-orders.actions';
import { AppOrdersState } from '../models/app-orders-state.model';
import { AppOrdersFields } from '../models/state-fields';

export const initialState: AppOrdersState = {
    [AppOrdersFields.ORDERS]: [],
};

export const appOrdersReducer = createReducer(
    initialState,

    on(
        AppOrdersActions.loadOrdersSuccess,
        (state, { orders }): AppOrdersState => ({
            ...state,
            [AppOrdersFields.ORDERS]: orders,
        })
    ),

    on(AppOrdersActions.cancelOrderSuccess, (state, { orderId }): AppOrdersState => {
        const currentOrders = state[AppOrdersFields.ORDERS];

        if (!currentOrders || !currentOrders.length) {
            return state;
        }

        const updatedOrders = currentOrders.map((order) => {
            if (order.id === orderId) {
                return { ...order, status: OrderStatus.REJECTED };
            }
            return order;
        });

        return {
            ...state,

            [AppOrdersFields.ORDERS]: updatedOrders,
        };
    })
);
