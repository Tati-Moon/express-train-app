import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { HttpService } from '../../core/services/http.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpService) {}

    public logOut(token: string): Observable<void> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.delete<void>({ url: environment.apiLogout, headers });
    }
}
