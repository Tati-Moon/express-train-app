import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';

import { ConvertedOrder } from '../../../core/models/orders/orders.model';
import { AppOrdersActions } from '../../../redux/actions/app-orders.actions';
import { selectMappedOrders } from '../../../redux/selectors/app-orders.selector';
import { OrdersTableComponent } from '../../components/orders-table/orders-table.component';
import { OrdersService } from '../../services/orders.service';

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [OrdersTableComponent, CommonModule],
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
    private store = inject(Store);

    public orders: Signal<ConvertedOrder[]> = signal([]);

    constructor(private ordersService: OrdersService) {
        const orders$ = this.store.select(selectMappedOrders);
        this.orders = toSignal(orders$, { initialValue: [] });
    }

    ngOnInit(): void {
        this.store.dispatch(AppOrdersActions.loadOrders({ all: true }));
    }
}
