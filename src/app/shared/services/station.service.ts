import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { Station } from '../../core/models/station/station.model';
import { selectStationById } from '../../redux/selectors/app-stations.selector';

@Injectable({
    providedIn: 'root',
})
export class StationService {
    private store = inject(Store);

    stationsMap: Map<number, Observable<Station | null>> = new Map();

    getStation(id: number): Observable<Station | null> {
        if (!this.stationsMap.has(id)) {
            const stationSelector = selectStationById(id);
            const station$ = this.store.select(stationSelector);
            this.stationsMap.set(id, station$);
        }
        return this.stationsMap.get(id) || of(null);
    }
}
