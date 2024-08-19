import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';

import { ConfigComponent } from '../../core/components/config/config.component';
import { Schemes } from '../../core/models/enums/constants';
import { Routers } from '../../core/models/enums/routers';
import { HttpService } from '../../core/services/http.service';
import { selectColorScheme } from '../../redux/selectors/app-theme.selector';
import { AuthFormFields } from '../models/auth-form.model';
import { SignUpErrorResponse } from '../models/response.model';
import { ErrorMessageService } from '../services/error-message.service';
import { RegisterFormService } from '../services/register-form.service';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        RippleModule,
        ConfigComponent,
        MessagesModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss',
})
export class SignupComponent {
    private store = inject(Store);
    messages: Message[] | undefined;
    public Routers = Routers;
    public colorScheme!: Signal<string>;
    constructor(
        private registerFormService: RegisterFormService,
        private errorMessageService: ErrorMessageService,
        private httpService: HttpService
    ) {
        const colorScheme$ = this.store.select(selectColorScheme);
        this.colorScheme = toSignal(colorScheme$, { initialValue: Schemes.LIGHT });
    }

    valCheck: string[] = ['remember'];

    public get form() {
        return this.registerFormService.registerForm;
    }
    login = this.form.get([this.fields.LOGIN])?.value;
    password = this.form.get([this.fields.PASSWORD])?.value;
    repeatPassword = this.form.get([this.fields.REPEAT_PASSWORD])?.value;

    public get fields() {
        return AuthFormFields;
    }

    public handleSubmit(): void {
        if (!this.form.valid) {
            this.registerFormService.markFormDirty(this.form);
            return;
        }

        const login = this.form.get([this.fields.LOGIN])?.value;
        console.log('🚀 ~ SignupComponent ~ handleSubmit ~ login:', login);
        const password = this.form.get([this.fields.PASSWORD])?.value;
        // console.log('🚀 ~ SignupComponent ~ handleSubmit ~ password:', password);

        this.httpService
            .post<SignUpErrorResponse>({
                url: '/api/signup',
                body: {
                    email: login,
                    password,
                },
            })
            .subscribe({
                next: (response) => {
                    if ('error' in response) {
                        console.error('Sign-up failed:', response.error.message);
                        // this.handleSignUpError(response.error);
                    } else {
                        console.log('Sign-up successful');
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
