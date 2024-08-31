import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Observable, of } from 'rxjs';

// eslint-disable-next-line max-len
import { DeleteConfirmationComponent } from '../../../admin/components/delete-confirmation/delete-confirmation.component';
import { ConvertedOrder, Order, OrderStatus } from '../../../core/models/orders/orders.model';
import { Station } from '../../../core/models/station/station.model';
import { AppOrdersActions } from '../../../redux/actions/app-orders.actions';
import { selectStationById } from '../../../redux/selectors/app-stations.selector';

@Component({
    selector: 'app-orders-table',
    standalone: true,
    imports: [TableModule, ButtonModule, TranslateModule, CommonModule, DeleteConfirmationComponent],
    templateUrl: './orders-table.component.html',
    styleUrl: './orders-table.component.scss',
})
export class OrdersTableComponent {
    private store = inject(Store);

    @Input() public orders: ConvertedOrder[] = [];
    stationsMap: Map<number, Observable<Station | null>> = new Map();
    public deleteModalVisible: boolean = false;
    public orderToDelete!: number;

    public OrderStatus = OrderStatus;

    public handleDeleteOrder(order: Order): void {
        this.orderToDelete = order.id;
        this.deleteModalVisible = true;
    }

    onConfirmDelete(id: number): void {
        this.store.dispatch(AppOrdersActions.initCancelOrder({ orderId: id }));
        this.deleteModalVisible = false;
        this.orderToDelete = id;
    }

    onCancelDelete(): void {
        this.deleteModalVisible = false;
        this.orderToDelete = null!;
    }

    getStation(id: number): Observable<Station | null> {
        if (!this.stationsMap.has(id)) {
            const stationSelector = selectStationById(id);
            const station$ = this.store.select(stationSelector);
            this.stationsMap.set(id, station$);
        }
        return this.stationsMap.get(id) || of(null);
    }
}
