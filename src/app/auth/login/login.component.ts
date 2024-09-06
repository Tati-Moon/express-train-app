import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LocalStorageFields, Schemes } from '../../core/models/enums/constants';
import { Routers } from '../../core/models/enums/routers';
import { HttpService } from '../../core/services/http.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { AppUserActions } from '../../redux/actions/app-user.actions';
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
export class LoginComponent implements OnInit, OnDestroy {
    private store = inject(Store);

    public colorScheme!: Signal<string>;
    public disableForm: boolean = false;
    public isClicked: boolean = false;
    private userTypeSubscription!: Subscription;
    private loginSubscription!: Subscription;
    private updating: boolean = false;

    constructor(
        private loginFormService: LoginFormService,
        private errorMessageService: ErrorMessageService,
        private httpService: HttpService,
        private localStorageService: LocalStorageService,
        private router: Router
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
    ngOnInit() {
        this.subscribeToUserType();
        this.subscribeToLoginChanges();
    }
    private subscribeToUserType(): void {
        const repeatPasswordControl = this.form.get(this.fields.PASSWORD);
        if (repeatPasswordControl) {
            this.userTypeSubscription = repeatPasswordControl.valueChanges.subscribe(() => {
                if (!this.updating) {
                    this.updating = true;
                    this.form.get(this.fields.LOGIN)?.updateValueAndValidity();
                    this.updating = false;
                }
            });
        }
    }

    private subscribeToLoginChanges(): void {
        const loginControl = this.form.get(this.fields.LOGIN);
        if (loginControl) {
            this.loginSubscription = loginControl.valueChanges.subscribe(() => {
                if (!this.updating) {
                    this.updating = true;
                    this.form.get(this.fields.PASSWORD)?.updateValueAndValidity();
                    this.updating = false;
                }
            });
        }
    }
    ngOnDestroy() {
        if (this.userTypeSubscription) {
            this.userTypeSubscription.unsubscribe();
        }
        if (this.loginSubscription) {
            this.loginSubscription.unsubscribe();
        }
    }
    public handleSubmit(): void {
        this.isClicked = true;
        if (!this.form.valid) {
            this.loginFormService.markFormDirty(this.form);
            return;
        }

        const login = this.form.get([this.fields.LOGIN])?.value;

        const password = this.form.get([this.fields.PASSWORD])?.value;
        this.disableForm = true;
        this.httpService
            .post<SignInSuccessResponse | SignInErrorResponse>({
                url: environment.apiSignIn,
                body: {
                    email: login,
                    password,
                },
            })
            .subscribe({
                next: (response) => {
                    this.disableForm = false;
                    if ('token' in response) {
                        console.log('Login successful:', response.token);
                        this.localStorageService.setItem(LocalStorageFields.TOKEN, response.token);

                        this.router.navigate([Routers.ROOT]);
                        this.form.reset();
                        this.store.dispatch(AppUserActions.logIn({ email: login, token: response.token }));
                    } else if ('error' in response) {
                        console.error('Login failed:', response.error.message);
                    }
                    this.disableForm = false;
                },
                error: (error) => {
                    this.disableForm = false;
                    if (error?.reason === 'userNotFound') {
                        this.form.get([this.fields.LOGIN])?.setErrors({ userNotFound: true });
                        this.form.get([this.fields.PASSWORD])?.setErrors({ userNotFound: true });
                        return;
                    }
                    console.error('handleSubmit', error);
                },
            });
    }

    public handleLoginErrorMessages(errors: ValidationErrors | null): string[] {
        return this.errorMessageService.getLoginErrorMessages(errors);
    }

    public handlePasswordErrorMessages(errors: ValidationErrors | null): string[] {
        return this.errorMessageService.getPasswordErrorMessages(errors);
    }

    public get disabledSubmitButton(): boolean {
        return !this.form.valid || this.disableForm;
    }
}
