import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { map, Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Station } from '../../core/models/station/station.model';
import { HttpService } from '../../core/services/http.service';
import {
    ConnectedStationCreateForm,
    ConnectedStationCreateFormFields,
    StationCreateForm,
    StationCreateFormFields,
} from '../models/station-create-form';

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
        [StationCreateFormFields.STATIONS]: this.fb.array([]),
        [StationCreateFormFields.CONNECTED_TO]: this.fb.array([
            this.fb.group<ConnectedStationCreateForm>({
                [ConnectedStationCreateFormFields.ID]: [0, [Validators.required]],
                [ConnectedStationCreateFormFields.CITY]: [
                    '',
                    [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
                ],
                [ConnectedStationCreateFormFields.LATITUDE]: [
                    0,
                    [Validators.required, Validators.min(-90), Validators.max(90)],
                ],
                [ConnectedStationCreateFormFields.LONGITUDE]: [
                    0,
                    [Validators.required, Validators.min(-180), Validators.max(180)],
                ],
                [ConnectedStationCreateFormFields.DISTANCE]: [
                    1,
                    [Validators.required, Validators.min(1), Validators.max(10000)],
                ],
            }),
        ]),
    });

    public getStations(): Observable<Station[]> {
        return this.http.get<Station[]>({ url: environment.apiUrlStation }).pipe(
            map((stations: Station[]) => {
                stations.forEach((station) => {
                    station.connectedTo.forEach((connected) => {
                        const connectedStation = stations.find((s) => s.id === connected.id);

                        if (connectedStation) {
                            // eslint-disable-next-line no-param-reassign
                            connected.city = connectedStation?.city;
                            // eslint-disable-next-line no-param-reassign
                            connected.latitude = connectedStation?.latitude;
                            // eslint-disable-next-line no-param-reassign
                            connected.longitude = connectedStation?.longitude;
                        }
                    });
                });

                return stations;
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
        this.http.delete<void>({ url: `${environment.apiUrlStation}/${id}` });
        return of();
    }
}
