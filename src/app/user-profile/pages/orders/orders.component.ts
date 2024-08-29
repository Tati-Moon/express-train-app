import { Component, OnInit } from '@angular/core';

import { Order } from '../../../core/models/orders/orders.model';
import { OrdersTableComponent } from '../../components/orders-table/orders-table.component';
import { OrdersService, User } from '../../services/orders.service';

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [OrdersTableComponent],
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
    public orders: Order[] = [];

    constructor(private ordersService: OrdersService) {}

    ngOnInit(): void {
        this.ordersService.getOrders(true).subscribe({
            next: (response: Order[]) => {
                this.orders = response;
                console.log('Orders loaded successfully:', response);
            },
            error: (errorResponse) => {
                if (errorResponse.error && errorResponse.error.message && errorResponse.error.reason) {
                    console.error('Profile loading failed:', errorResponse.error.message);
                } else {
                    console.error('Unexpected error:', errorResponse);
                }
            },
        });
        this.ordersService.getUsers().subscribe({
            next: (response: User[]) => {
                console.log('Users loaded successfully:', response);
            },
            error: (errorResponse) => {
                if (errorResponse.error && errorResponse.error.message) {
                    console.error('Users loading failed:', errorResponse.error.message);
                } else {
                    console.error('Unexpected error:', errorResponse);
                }
            },
        });
    }
}
