import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SearchFilter } from '../../core/models/search/search-filter.model';
import { SearchResult } from '../../core/models/search/search-result.model';
import { HttpService } from '../../core/services/http.service';

@Injectable({
    providedIn: 'root',
})
export class SearchService {
    constructor(private http: HttpService) {}

    public search(filter: SearchFilter): Observable<SearchResult> {
        let params = new HttpParams()
            .set('fromLatitude', filter.fromLatitude.toString())
            .set('fromLongitude', filter.fromLongitude.toString())
            .set('toLatitude', filter.toLatitude.toString())
            .set('toLongitude', filter.toLongitude.toString());

        if (filter.date) {
            // const dateObject = new Date(filter.date);
            // console.log('dateObject', dateObject);
            // const unixTimestamp = Math.floor(dateObject.getTime() / 1000);
            params = params.set('time', filter.date);
        }
        console.log('filter', filter);
        console.log('params', params);

        return this.http.get<SearchResult>({ url: environment.apiUrlSearch, params }).pipe(
            map((response: SearchResult) => {
                console.log('response', response);
                return response;
            })
        );
    }
}
