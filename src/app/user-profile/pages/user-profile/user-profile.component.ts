import { CommonModule } from '@angular/common';
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

import { AuthFormFields } from '../../../auth/models/auth-form.model';
import { ErrorMessageService } from '../../../auth/services/error-message.service';
import { UserProfileService } from '../../../auth/services/user-profile-form.service';
import { Schemes } from '../../../core/models/enums/constants';
import { selectColorScheme } from '../../../redux/selectors/app-theme.selector';

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

    constructor(
        private userProfileService: UserProfileService,
        private errorMessageService: ErrorMessageService,
        private router: Router
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
    }

    getUserProfile(): void {
        this.userProfileService.getProfile();
    }

    toggleEditName(): void {
        this.isEditingName = !this.isEditingName;
    }

    toggleEditEmail(): void {
        this.isEditingEmail = !this.isEditingEmail;
    }

    saveUserEmail(): void {
        if (this.form.get(this.fields.LOGIN)) {
            this.userProfileService.updateUserEmail(this.form.get(this.fields.LOGIN)?.value);
            this.toggleEditEmail();
        }
    }

    saveUserName(): void {
        if (this.form.get(this.fields.NAME)) {
            this.userProfileService.updateUserName(this.form.get(this.fields.NAME)?.value);
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

    changePassword(): void {
        if (this.passwordForm.get(this.fields.PASSWORD)) {
            this.userProfileService.updatePassword(this.form.get(this.fields.PASSWORD)?.value);
            this.closePasswordModal();
            this.passwordForm.reset();
        }
    }

    logout(): void {
        this.userProfileService.logout();
        this.router.navigate(['/']);
    }
}
