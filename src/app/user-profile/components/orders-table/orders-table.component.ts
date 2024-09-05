import { CommonModule } from '@angular/common';
import { Component, inject, Input, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Observable, of } from 'rxjs';

// eslint-disable-next-line max-len
import { DeleteConfirmationComponent } from '../../../admin/components/delete-confirmation/delete-confirmation.component';
import { ConvertedOrder, OrderStatus } from '../../../core/models/orders/orders.model';
import { Station } from '../../../core/models/station/station.model';
import { AppDatePipe } from '../../../core/pipes/date.pipe';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { AppOrdersActions } from '../../../redux/actions/app-orders.actions';
import { selectStationById } from '../../../redux/selectors/app-stations.selector';
import { selectIsAdmin } from '../../../redux/selectors/app-user.selector';

@Component({
    selector: 'app-orders-table',
    standalone: true,
    imports: [TableModule, ButtonModule, TranslateModule, CommonModule, DeleteConfirmationComponent, AppDatePipe],
    templateUrl: './orders-table.component.html',
    styleUrl: './orders-table.component.scss',
})
export class OrdersTableComponent {
    private store = inject(Store);
    localStorage = inject(LocalStorageService);

    @Input() public orders: ConvertedOrder[] = [];
    stationsMap: Map<number, Observable<Station | null>> = new Map();
    public deleteModalVisible: boolean = false;
    public orderToDelete!: number;
    public nameUserToDeleteOrder: string = '';
    public isAdmin: Signal<boolean> = signal(false);
    public OrderStatus = OrderStatus;

    constructor() {
        const isAdmin$ = this.store.select(selectIsAdmin);
        this.isAdmin = toSignal(isAdmin$, { initialValue: false });
    }

    public handleDeleteOrder(order: ConvertedOrder): void {
        this.orderToDelete = order.id;
        this.nameUserToDeleteOrder = order.user?.name ?? order.user?.email ?? '';
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
