import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';

import { Schemes } from '../../core/models/enums/constants';
import { HttpService } from '../../core/services/http.service';
import { selectColorScheme } from '../../redux/selectors/app-theme.selector';
import { AuthFormFields } from '../models/auth-form.model';
import { SignInErrorResponse, SignInSuccessResponse } from '../models/response.model';
import { ErrorMessageService } from '../services/error-message.service';
import { LoginFormService } from '../services/login-form.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        RippleModule,
        TranslateModule,
        ReactiveFormsModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    private store = inject(Store);

    public colorScheme!: Signal<string>;
    constructor(
        private loginFormService: LoginFormService,
        private errorMessageService: ErrorMessageService,
        private httpService: HttpService
    ) {
        const colorScheme$ = this.store.select(selectColorScheme);
        this.colorScheme = toSignal(colorScheme$, { initialValue: Schemes.LIGHT });
    }

    public get form() {
        return this.loginFormService.loginForm;
    }

    public get fields() {
        return AuthFormFields;
    }

    public handleSubmit(): void {
        if (!this.form.valid) {
            this.loginFormService.markFormDirty(this.form);
            return;
        }

        const login = this.form.get([this.fields.LOGIN])?.value;

        const password = this.form.get([this.fields.PASSWORD])?.value;

        this.httpService
            .post<SignInSuccessResponse | SignInErrorResponse>({
                url: '/api/signin',
                body: {
                    email: login,
                    password,
                },
            })
            .subscribe({
                next: (response) => {
                    if ('token' in response) {
                        console.log('Login successful:', response.token);
                    } else if ('error' in response) {
                        console.error('Login failed:', response.error.message);
                        // this.handleLoginError(response.error);
                    }
                },
                error: (error) => {
                    console.error('Unexpected error:', error);
                },
            });
        // this.store.dispatch(Actions.login({ login, password }));
        // this.form.reset();
    }

    public handleLoginErrorMessages(errors: ValidationErrors | null): string[] {
        return this.errorMessageService.getLoginErrorMessages(errors);
    }

    public handlePasswordErrorMessages(errors: ValidationErrors | null): string[] {
        return this.errorMessageService.getPasswordErrorMessages(errors);
    }
}
