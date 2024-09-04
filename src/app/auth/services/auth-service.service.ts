import { HttpHeaders } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LocalStorageFields } from '../../core/models/enums/constants';
import { UserRole } from '../../core/models/user/user.model';
import { HttpService } from '../../core/services/http.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { selectUserRole } from '../../redux/selectors/app-user.selector';
import { UserProfileSuccessResponse } from '../models/response.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private store = inject(Store);
    public userRole!: Signal<UserRole | null>;
    constructor(
        private http: HttpService,
        private localStorageService: LocalStorageService
    ) {
        const userRole$ = this.store.select(selectUserRole);
        this.userRole = toSignal(userRole$, { initialValue: null });
    }

    public logOut(token: string): Observable<void> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const btoaRole = btoa(LocalStorageFields.ROLE as string);
        const btoaEmail = btoa(LocalStorageFields.EMAIL as string);

        this.localStorageService.removeItem(LocalStorageFields.TOKEN);
        this.localStorageService.removeItem(btoaRole);
        this.localStorageService.removeItem(btoaEmail);

        if (this.localStorageService.hasItem(LocalStorageFields.EMAIL)) {
            this.localStorageService.removeItem(LocalStorageFields.EMAIL);
        }

        if (this.localStorageService.hasItem(LocalStorageFields.ROLE)) {
            this.localStorageService.removeItem(LocalStorageFields.ROLE);
        }

        return this.http.delete<void>({ url: environment.apiLogout, headers });
    }

    public getUserProfile(): Observable<UserProfileSuccessResponse> {
        return this.http.get<UserProfileSuccessResponse>({ url: environment.apiProfile });
    }
}
