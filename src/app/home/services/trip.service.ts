import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { HttpService } from '../../core/services/http.service';
import { SeatForBook, Trip } from '../models';

@Injectable({
    providedIn: 'root',
})
export class TripService {
    constructor(private http: HttpService) {}

    public getRideInformation(rideId: number): Observable<Trip> {
        const url = environment.apiUrlGetRideInformation + rideId;
        return this.http.get<Trip>({ url });
    }

    public postOrder(seatForBook: SeatForBook): Observable<SeatForBook> {
        const url = environment.apiUrlPostOrder;
        return this.http.post<SeatForBook>({
            url,
            body: {
                rideId: seatForBook.rideId,
                seat: seatForBook.seat,
                stationStart: seatForBook.stationStart,
                stationEnd: seatForBook.stationEnd,
            },
        });
    }
}
