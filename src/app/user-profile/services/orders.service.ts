import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Order } from '../../core/models/orders/orders.model';
import { HttpService } from '../../core/services/http.service';

@Injectable({
    providedIn: 'root',
})
export class OrdersService {
    constructor(private http: HttpService) {}

    public getOrders(all: boolean = false): Observable<Order[]> {
        const params = new HttpParams().set('all', all.toString());

        return this.http.get<Order[]>({
            url: environment.apiOrder,
            params,
        });
    }

    public deleteOrder(id: number): Observable<void> {
        return this.http.delete<void>({ url: `${environment.apiOrder}/${id}` });
    }
}
