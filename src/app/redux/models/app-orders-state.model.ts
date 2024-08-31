import { Order } from '../../core/models/orders/orders.model';
import { AppOrdersFields } from './state-fields';

export interface AppOrdersState {
    [AppOrdersFields.ORDERS]: Order[];
}
