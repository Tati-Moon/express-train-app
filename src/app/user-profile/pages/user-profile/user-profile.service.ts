import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { UserProfile } from './user-profile.interface';

@Injectable({
    providedIn: 'root',
})
export class UserProfileService {
    private userProfile: UserProfile = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'SomeTestPassword_123',
        role: 'Manager',
    };

    getProfile(): Observable<UserProfile> {
        console.log('getProfile', this.userProfile);
        return of(this.userProfile);
    }

    updateUserName(data: Partial<UserProfile>): Observable<UserProfile> {
        this.userProfile = { ...this.userProfile, ...data };
        return of(this.userProfile);
    }

    updateUserEmail(data: Partial<UserProfile>): Observable<UserProfile> {
        this.userProfile = { ...this.userProfile, ...data };
        return of(this.userProfile);
    }

    updatePassword(newPassword: string): Observable<UserProfile> {
        this.userProfile.password = newPassword;
        console.log(`Password updated to: ${newPassword}`);
        return of(this.userProfile);
    }

    logout(): Observable<void> {
        console.log('User logged out');
        return of();
    }
}
