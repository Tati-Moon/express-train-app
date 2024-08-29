import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { Order } from '../../../core/models/orders/orders.model';

@Component({
    selector: 'app-orders-table',
    standalone: true,
    imports: [TableModule, ButtonModule, TranslateModule, CommonModule],
    templateUrl: './orders-table.component.html',
    styleUrl: './orders-table.component.scss',
})
export class OrdersTableComponent {
    @Input() public orders: Order[] = [];

    public handleDeleteOrder(order: Order): void {
        console.log('🚀 ~ OrdersTableComponent ~ handleDeleteOrder ~ order:', order);
        console.log('\x1b[31m%s\x1b[0m', 'handleDeleteOrder');
    }
}
