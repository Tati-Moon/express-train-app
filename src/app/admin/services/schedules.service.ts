import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Carriage } from '../../core/models';
import { ScheduleRide, Segment, Station } from '../../core/models/schedules/schedule.model';
import { HttpService } from '../../core/services/http.service';
import {
    CreateRideForm,
    CreateRideFormFields,
    RideTimeCreateForm,
    RideTimeCreateFormFields,
} from '../models/ride-create-form.model';
import { ScheduleCreateForm, ScheduleCreateFormFields } from '../models/schedule-create-form.model';

@Injectable({
    providedIn: 'root',
})
export class SchedulesService {
    constructor(
        private http: HttpService,
        private fb: FormBuilder
    ) {}

    public scheduleCreateForm: FormGroup = this.fb.group<ScheduleCreateForm>({
        [ScheduleCreateFormFields.ID]: [0, [Validators.required]],
        [ScheduleCreateFormFields.PATH]: this.fb.array([]),
        [ScheduleCreateFormFields.CARRIAGES]: this.fb.array([]),
        [ScheduleCreateFormFields.SCHEDULE]: this.fb.array([]),
        [ScheduleCreateFormFields.CARRIAGES_LIST]: this.fb.array([]),
        [ScheduleCreateFormFields.STATIONS_LIST]: this.fb.array([]),
    });

    public scheduleCreateNewRideForm: FormGroup = this.fb.group<ScheduleCreateForm>({
        [ScheduleCreateFormFields.ID]: [0, [Validators.required]],
        [ScheduleCreateFormFields.PATH]: this.fb.array([]),
        [ScheduleCreateFormFields.CARRIAGES]: this.fb.array([]),
        [ScheduleCreateFormFields.SCHEDULE]: this.fb.array([]),
        [ScheduleCreateFormFields.CARRIAGES_LIST]: this.fb.array([]),
        [ScheduleCreateFormFields.STATIONS_LIST]: this.fb.array([]),
    });

    public rideTimeCreateForm: FormGroup = this.fb.group<RideTimeCreateForm>({
        [RideTimeCreateFormFields.ARRIVAL]: ['', []],
        [RideTimeCreateFormFields.DEPARTURE]: ['', []],
    });

    public createRideForm: FormGroup = this.fb.group<CreateRideForm>({
        [CreateRideFormFields.ID]: [0, [Validators.required]],
        [CreateRideFormFields.SEGMENTS]: this.fb.array([]),
    });

    public getStations(): Observable<Station[]> {
        return this.http
            .get<Station[]>({ url: `${environment.apiUrlStation}` })
            .pipe(map((response: Station[]) => response));
    }

    public getCarriages(): Observable<Carriage[]> {
        return this.http
            .get<Carriage[]>({ url: `${environment.apiUrlGetCarriages}` })
            .pipe(map((response: Carriage[]) => response));
    }

    public getRouteSchedule(id: number): Observable<ScheduleRide> {
        return this.http.get<ScheduleRide>({ url: `${environment.apiUrlRoute}/${id}` });
    }

    public createRide(routeId: number, segments: Segment[]): Observable<{ id: number }> {
        return this.http.post<{ id: number }>({
            url: `${environment.apiUrlRoute}/${routeId}/ride`,
            body: { segments },
        });
    }

    public updateRide(routeId: number, rideId: number, segments: Segment[]): Observable<Segment[]> {
        return this.http.put<Segment[]>({
            url: `${environment.apiUrlRoute}/${routeId}/ride/${rideId}`,
            body: { segments },
        });
    }

    public deleteRide(routeId: number, rideId: number): Observable<object> {
        return this.http.delete<object>({
            url: `${environment.apiUrlRoute}/${routeId}/ride/${rideId}`,
        });
    }
}
