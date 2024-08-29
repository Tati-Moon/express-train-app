import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Station } from '../../core/models/station/station.model';
import { HttpService } from '../../core/services/http.service';
import { StationCreateForm, StationCreateFormFields } from '../models/station-create-form';
import { notEmptyArrayValidator } from './array-validator';

@Injectable({
    providedIn: 'root',
})
export class StationsService {
    constructor(
        private http: HttpService,
        private fb: FormBuilder
    ) {}

    public stationCreateForm = this.fb.group<StationCreateForm>({
        [StationCreateFormFields.ID]: [0, [Validators.required]],
        [StationCreateFormFields.CITY]: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        [StationCreateFormFields.LATITUDE]: [0, [Validators.required, Validators.min(-90), Validators.max(90)]],
        [StationCreateFormFields.LONGITUDE]: [0, [Validators.required, Validators.min(-180), Validators.max(180)]],
        [StationCreateFormFields.STATIONS]: [[], []],
        [StationCreateFormFields.CONNECTED_TO]: this.fb.array([], notEmptyArrayValidator),
    });

    public getStations(): Observable<Station[]> {
        return this.http.get<Station[]>({ url: environment.apiUrlStation }).pipe(
            map((stations: Station[]) => {
                return stations.map((station) => {
                    const updatedConnectedTo = station.connectedTo.map((connected) => {
                        const connectedStation = stations.find((s) => s.id === connected.id);
                        return {
                            ...connected,
                            city: connectedStation?.city || connected.city,
                            latitude: connectedStation?.latitude || connected.latitude,
                            longitude: connectedStation?.longitude || connected.longitude,
                        };
                    });

                    const cities = updatedConnectedTo.map((item) => {
                        const foundCity = stations.find((s) => s.id === item.id)?.city;
                        return foundCity || 'Unknown';
                    });

                    return {
                        ...station,
                        connectedTo: updatedConnectedTo,
                        cities,
                    };
                });
            })
        );
    }

    public postStation(station: Station): Observable<Station> {
        return this.http.post<Station>({ url: environment.apiUrlStation, body: station });
    }

    public putStation(station: Station): Observable<Station> {
        this.http.delete<void>({ url: `${environment.apiUrlStation}/${station.id}` });
        return this.http.post<Station>({ url: environment.apiUrlStation, body: station });
    }

    public deleteStation(id: number): Observable<void> {
        return this.http.delete<void>({ url: `${environment.apiUrlStation}/${id}` });
    }
}
