import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { forkJoin, map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Route } from '../../core/models/route/route.model';
import { HttpService } from '../../core/services/http.service';
import { RouteCreateForm, RouteCreateFormFields } from '../models/route-create-form.model';
import { minThreeElementsValidator } from './array-validator';
import { StationsService } from './stations.service';

@Injectable({
    providedIn: 'root',
})
export class RoutesService {
    constructor(
        private http: HttpService,
        private stationsService: StationsService,
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

    public getRoutes(): Observable<Route[]> {
        return forkJoin({
            // TODO need refactoring, move logic to component
            routes: this.http.get<Route[]>({ url: `${environment.apiUrlRoute}` }),
            stations: this.stationsService.getStations(),
        }).pipe(
            map(({ routes, stations }) => {
                return routes.map((route) => {
                    const routeCities = route.path.map((stationId) => {
                        const station = stations.find((s) => s.id === stationId);
                        return station?.city || 'Unknown';
                    });

                    return {
                        ...route,
                        cities: routeCities,
                    };
                });
            })
        );
    }

    public createRoute(route: Route): Observable<{ id: number }> {
        return this.http.post<{ id: number }>({ url: `${environment.apiUrlRoute}`, body: route });
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
