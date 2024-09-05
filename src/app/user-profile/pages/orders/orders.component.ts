import { CommonModule } from '@angular/common';
import { Component, effect, inject, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';

import { NoOrdersComponent } from '../../../core/components/no-orders/no-orders.component';
import { ConvertedOrder } from '../../../core/models/orders/orders.model';
import { UserRole } from '../../../core/models/user/user.model';
import { AppOrdersActions } from '../../../redux/actions/app-orders.actions';
import { selectMappedOrders } from '../../../redux/selectors/app-orders.selector';
import { selectUserRole } from '../../../redux/selectors/app-user.selector';
import { OrdersTableComponent } from '../../components/orders-table/orders-table.component';

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [OrdersTableComponent, CommonModule, NoOrdersComponent],
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.scss',
})
export class OrdersComponent {
    private store = inject(Store);

    public orders: Signal<ConvertedOrder[]> = signal([]);
    public userRole: Signal<UserRole | null> = signal(null);

    constructor() {
        const orders$ = this.store.select(selectMappedOrders);
        this.orders = toSignal(orders$, { initialValue: [] });
        const userRole$ = this.store.select(selectUserRole);
        this.userRole = toSignal(userRole$, { initialValue: null });
        effect(
            () => {
                const role = this.userRole();

                if (role) {
                    this.store.dispatch(AppOrdersActions.loadOrders({ all: role === UserRole.MANAGER }));
                }
            },
            { allowSignalWrites: true }
        );
    }
}
