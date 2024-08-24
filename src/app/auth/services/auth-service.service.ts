import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LocalStorageFields } from '../../core/models/enums/constants';
import { HttpService } from '../../core/services/http.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { UserProfileSuccessResponse } from '../models/response.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private http: HttpService,
        private localStorageService: LocalStorageService
    ) {}

    public logOut(token: string): Observable<void> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        this.localStorageService.removeItem(LocalStorageFields.TOKEN);

        return this.http.delete<void>({ url: environment.apiLogout, headers });
    }

    public getUserProfile(): Observable<UserProfileSuccessResponse> {
        return this.http.get<UserProfileSuccessResponse>({ url: environment.apiProfile });
    }
}
