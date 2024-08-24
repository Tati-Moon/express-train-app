import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { catchError, filter, Observable, tap, throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { AuthFormFields } from '../../../auth/models/auth-form.model';
import { ErrorMessageService } from '../../../auth/services/error-message.service';
import { UserProfileService } from '../../../auth/services/user-profile-form.service';
import { Schemes } from '../../../core/models/enums/constants';
import { HttpService } from '../../../core/services/http.service';
import { AppUserActions } from '../../../redux/actions/app-user.actions';
import { UserRole } from '../../../redux/models/app-user-state.model';
import { selectColorScheme } from '../../../redux/selectors/app-theme.selector';
import { selectToken } from '../../../redux/selectors/app-user.selector';

interface PutUserProfileResponse {
    name: string;
    email: string;
    role: 'manager' | 'user';
}

interface ErrorResponse {
    error: {
        message: string;
        reason: string;
    };
}

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        InputTextModule,
        ButtonModule,
        DialogModule,
        TranslateModule,
        PasswordModule,
        ProgressSpinnerModule,
    ],
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
    private store = inject(Store);
    public isEditingName = false;
    public isEditingEmail = false;
    public isPasswordModalOpen = false;
    public colorScheme!: Signal<string>;
    public isLoading = true;
    token$ = this.store.select(selectToken);
    public token: string | null = null;

    constructor(
        private userProfileService: UserProfileService,
        private errorMessageService: ErrorMessageService,
        private router: Router,
        private httpService: HttpService
    ) {
        const colorScheme$ = this.store.select(selectColorScheme);

        this.colorScheme = toSignal(colorScheme$, { initialValue: Schemes.LIGHT });
    }

    public get form() {
        return this.userProfileService.userProfileForm;
    }
    public get passwordForm() {
        return this.userProfileService.userPasswordForm;
    }
    name = this.form.get([this.fields.NAME])?.value;
    login = this.form.get([this.fields.LOGIN])?.value;
    password = this.passwordForm.get([this.fields.PASSWORD])?.value;

    public get fields() {
        return AuthFormFields;
    }

    public handleNameErrorMessages(errors: ValidationErrors | null): string[] {
        return this.errorMessageService.getNameErrorMessages(errors);
    }

    public handleLoginErrorMessages(errors: ValidationErrors | null): string[] {
        return this.errorMessageService.getLoginErrorMessages(errors);
    }

    public handlePasswordErrorMessages(errors: ValidationErrors | null): string[] {
        return this.errorMessageService.getPasswordErrorMessages(errors);
    }

    ngOnInit(): void {
        this.getUserProfile();
        this.store
            .select(selectToken)
            .pipe(
                tap((token) => {
                    if (!token) {
                        this.router.navigate(['/signin']);
                    }
                }),
                filter((token) => !!token),
                tap((token) => {
                    this.token = token;
                    this.getUserProfile();
                })
            )
            .subscribe();
    }

    getUserProfile(): void {
        if (!this.token) return;
        interface UserProfileSuccessResponse {
            name: string;
            email: string;
            role: 'manager' | 'user';
        }

        interface UserProfileErrorResponse {
            error: {
                message: string;
                reason: 'invalidAccessToken' | string;
            };
        }

        type UserProfileResponse = UserProfileSuccessResponse | UserProfileErrorResponse;

        this.httpService
            .get<UserProfileResponse>({
                url: environment.apiProfile,
            })
            .subscribe({
                next: (response) => {
                    if ('error' in response) {
                        console.error('Profile loading failed:', response.error.message);
                        if (response.error.reason === 'invalidAccessToken') {
                            console.error('Reason:', response.error.reason);
                        }
                    } else {
                        const { email, name, role } = response;

                        console.log('User profile loaded successfully:', response.name, response.email, response.role);
                        this.store.dispatch(AppUserActions.updateUserData({ email, name, role: role as UserRole }));

                        this.userProfileService.getProfile();
                        this.isLoading = false;
                    }
                },
                error: (error) => {
                    console.error('Unexpected error:', error);
                },
            });
    }

    toggleEditName(): void {
        this.isEditingName = !this.isEditingName;
    }

    toggleEditEmail(): void {
        this.isEditingEmail = !this.isEditingEmail;
    }

    updateProfile(): void {
        const name = this.form.get(this.fields.NAME)?.value;
        const email = this.form.get(this.fields.LOGIN)?.value;
        const body = { name, email };

        this.httpService
            .put<PutUserProfileResponse>({ url: environment.apiProfile, body })
            .pipe(
                tap((response) => this.handleSuccess(response)),
                catchError((error) => this.handleError(error))
            )
            .subscribe();
    }

    private handleSuccess(response: PutUserProfileResponse): void {
        const { email, name, role } = response;
        console.log('User profile loaded successfully:', name, email, role);

        this.store.dispatch(AppUserActions.updateUserData({ email, name, role: role as UserRole }));
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        if (error.status === 401) {
            const errResponse = error.error as ErrorResponse;
            console.error('Profile loading failed:', errResponse.error.message);
            if (errResponse.error.reason === 'invalidAccessToken') {
                console.error('Reason:', errResponse.error.reason);
            }
        } else if (error.status === 400) {
            const errResponse = error.error as ErrorResponse;
            console.error('Profile loading failed:', errResponse.error.message);
            if (errResponse.error.reason === 'invalidUniqueKey') {
                console.error('Reason:', errResponse.error.reason);
            }
        } else {
            console.error('Unexpected error:', error);
        }
        this.isLoading = false;
        return throwError(() => error);
    }

    saveUserEmail(): void {
        if (this.form.get(this.fields.LOGIN)) {
            this.updateProfile();
            this.toggleEditEmail();
        }
    }

    saveUserName(): void {
        if (this.form.get(this.fields.NAME)) {
            this.updateProfile();
            this.toggleEditName();
        }
    }

    openPasswordModal(): void {
        this.isPasswordModalOpen = true;

        this.passwordForm.reset();
    }

    closePasswordModal(): void {
        this.isPasswordModalOpen = false;
    }
    updatePassword(newPassword: string): void {
        const body = { password: newPassword };

        this.httpService
            .put<void>({ url: environment.apiProfilePassword, body })
            .pipe(
                tap(() => {
                    console.log('Password updated successfully.');
                }),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = 'Unexpected error occurred.';
                    if (error.status === 401) {
                        const errResponse = error.error as ErrorResponse;
                        errorMessage = `Password update failed: ${errResponse.error.message}`;
                        if (errResponse.error.reason === 'invalidAccessToken') {
                            console.error('Reason:', errResponse.error.reason);
                        }
                    } else if (error.status === 400) {
                        const errResponse = error.error as ErrorResponse;
                        errorMessage = `Password update failed: ${errResponse.error.message}`;
                        if (errResponse.error.reason === 'invalidPassword') {
                            console.error('Reason:', errResponse.error.reason);
                        }
                    } else {
                        console.error('Unexpected error:', error);
                    }

                    console.error(errorMessage);
                    this.isLoading = false;
                    return throwError(() => error);
                })
            )
            .subscribe();
    }
    changePassword(): void {
        const newPassword = this.passwordForm.get(this.fields.PASSWORD)?.value;
        if (newPassword) {
            // this.userProfileService.updatePassword(this.form.get(this.fields.PASSWORD)?.value)
            this.updatePassword(newPassword);
            this.closePasswordModal();
            this.passwordForm.reset();
        }
    }

    logout(): void {
        this.store.dispatch(AppUserActions.logOut());
    }
}
