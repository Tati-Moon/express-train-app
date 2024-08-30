import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { forkJoin, map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Route } from '../../core/models/route/route.model';
import { Station } from '../../core/models/station/station.model';
import { HttpService } from '../../core/services/http.service';
import { RouteCreateForm, RouteCreateFormFields } from '../models/route-create-form.model';
import { minThreeElementsValidator } from './array-validator';

@Injectable({
    providedIn: 'root',
})
export class RoutesService {
    constructor(
        private http: HttpService,
        private fb: FormBuilder
    ) {}

    public routeCreateForm = this.fb.group<RouteCreateForm>({
        [RouteCreateFormFields.ID]: [0, [Validators.required]],
        [RouteCreateFormFields.PATH]: this.fb.array([], minThreeElementsValidator),
        [RouteCreateFormFields.CARRIAGES]: this.fb.array([], minThreeElementsValidator),
        [RouteCreateFormFields.STATIONS_LIST]: [[], []],
        [RouteCreateFormFields.CARRIAGES_LIST]: [[], []],
        [RouteCreateFormFields.CITIES]: this.fb.array([]),
    });

    public getStations(): Observable<Station[]> {
        return this.http
            .get<Station[]>({ url: `${environment.apiUrlStation}` })
            .pipe(map((response: Station[]) => response));
    }

    public getRoutes(): Observable<Route[]> {
        return forkJoin({
            routes: this.http.get<Route[]>({ url: `${environment.apiUrlRoute}` }),
            stations: this.getStations(),
        }).pipe(
            map(({ routes, stations }) => {
                return routes.map((route) => {
                    const routeStations = route.path.map((stationId) => {
                        const station = stations.find((s) => s.id === stationId);
                        return (
                            station || {
                                id: stationId,
                                city: 'Unknown',
                                connectedTo: [],
                                latitude: 0,
                                longitude: 0,
                                relations: [],
                                cities: [],
                            }
                        );
                    });

                    const routeCities = route.path.map((stationId) => {
                        const station = stations.find((s) => s.id === stationId);
                        return station?.city || 'Unknown';
                    });

                    return {
                        ...route,
                        stations: routeStations,
                        cities: routeCities,
                    };
                });
            })
        );
    }

    public createRoute(route: Route): Observable<Route> {
        return this.http.post<number>({ url: `${environment.apiUrlRoute}`, body: route }).pipe(
            map((id: number) => {
                return { ...route, id } as Route;
            })
        );
    }

    public updateRoute(id: number, route: Route): Observable<Route> {
        return this.http.put<number>({ url: `${environment.apiUrlRoute}/${id}`, body: route }).pipe(
            map(() => {
                return { ...route, id } as Route;
            })
        );
    }

    public deleteRoute(id: number): Observable<void> {
        return this.http.delete<void>({ url: `${environment.apiUrlRoute}/${id}` });
    }
}
