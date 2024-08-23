import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Carriage } from '../../core/models';
import { HttpService } from '../../core/services/http.service';

@Injectable({
    providedIn: 'root',
})
export class CarriagesService {
    constructor(private http: HttpService) {}

    public getCarriages(): Observable<Carriage[]> {
        return this.http.get<Carriage[]>({ url: environment.apiUrlGetCarriages });
    }

    public postCarriage(carriage: Carriage): Observable<Carriage> {
        return this.http.post<Carriage>({ url: environment.apiUrlPostCarriage, body: carriage });
    }

    public putCarriage(carriage: Carriage): Observable<Carriage> {
        const url = environment.apiUrlPutCarriage + carriage.code;
        return this.http.put<Carriage>({ url, body: carriage });
    }
}
