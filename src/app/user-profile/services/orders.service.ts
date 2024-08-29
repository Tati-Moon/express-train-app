import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Order } from '../../core/models/orders/orders.model';
import { HttpService } from '../../core/services/http.service';

export interface User {
    id: number;
    email: string;
    name: string;
    role: 'user' | 'manager';
}

@Injectable({
    providedIn: 'root',
})
export class OrdersService {
    constructor(private http: HttpService) {}

    public getOrders(all: boolean = false): Observable<Order[]> {
        console.log('🚀 ~ OrdersService ~ getOrders ~ all:', all);
        // const params = new HttpParams().set('all', all.toString());

        // return this.http.get<Order[]>({
        //     url: environment.apiOrder,
        //     params,
        // });
        // TODO Change to real
        const orders: Order[] = [
            {
                id: 64,
                rideId: 45,
                routeId: 18,
                seatId: 33,
                userId: 3,
                status: 'active',
                path: [33, 5, 62, 11, 48, 34],
                carriages: [
                    'carriage_type_2',
                    'carriage_type_2',
                    'carriage_type_2',
                    'carriage_type_2',
                    'carriage_type_7',
                    'carriage_type_7',
                    'carriage_type_7',
                    'carriage_type_7',
                ],
                schedule: {
                    segments: [
                        {
                            time: ['2024-08-08T22:19:57.708Z', '2024-08-12T03:29:57.708Z'],
                            price: {
                                'dynamic-carriage-type-1': 210,
                            },
                        },
                    ],
                },
            },
            {
                id: 65,
                rideId: 46,
                routeId: 19,
                seatId: 34,
                userId: 4,
                status: 'completed',
                path: [13, 6, 78, 23, 55, 31],
                carriages: [
                    'carriage_type_3',
                    'carriage_type_3',
                    'carriage_type_3',
                    'carriage_type_3',
                    'carriage_type_8',
                    'carriage_type_8',
                    'carriage_type_8',
                    'carriage_type_8',
                ],
                schedule: {
                    segments: [
                        {
                            time: ['2024-09-01T10:00:00.000Z', '2024-09-01T15:00:00.000Z'],
                            price: {
                                'dynamic-carriage-type-1': 250,
                            },
                        },
                    ],
                },
            },
        ];

        return of(orders);
    }

    public getUsers(): Observable<User[]> {
        return this.http.get<User[]>({
            url: environment.apiUsers,
        });
    }
}
