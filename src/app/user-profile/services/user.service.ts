import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { User } from '../../core/models/user/user.model';
import { HttpService } from '../../core/services/http.service';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private http: HttpService) {}

    public getUsers(): Observable<User[]> {
        return this.http.get<User[]>({
            url: environment.apiUsers,
        });
    }
}
