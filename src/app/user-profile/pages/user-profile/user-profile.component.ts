import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';

import { Schemes } from '../../../core/models/enums/constants';
import { selectColorScheme } from '../../../redux/selectors/app-theme.selector';
import { PasswordStrengthValidator } from './password-strength.validator';
import { UserProfileService } from './user-profile.service';

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
        RippleModule,
    ],
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
    private store = inject(Store);
    public userForm: FormGroup;
    public passwordForm: FormGroup;
    public isEditingName = false;
    public isEditingEmail = false;
    public isPasswordModalOpen = false;
    public colorScheme!: Signal<string>;

    constructor(
        private userProfileService: UserProfileService,
        private router: Router
    ) {
        this.userForm = new FormGroup({
            name: new FormControl({ value: '', disabled: true }, [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(30),
            ]),
            email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
            role: new FormControl({ value: '', disabled: true }),
        });

        this.passwordForm = new FormGroup({
            newPassword: new FormControl('', [Validators.required, PasswordStrengthValidator.strong]),
        });

        const colorScheme$ = this.store.select(selectColorScheme);
        this.colorScheme = toSignal(colorScheme$, { initialValue: Schemes.LIGHT });
    }

    ngOnInit(): void {
        this.getUserProfile();
    }

    getUserProfile(): void {
        this.userProfileService.getProfile().subscribe((userProfile) => {
            this.userForm.patchValue(userProfile);
        });
    }

    toggleEditName(): void {
        this.isEditingName = !this.isEditingName;
        this.toggleFormControl('name', this.isEditingName);
    }

    toggleEditEmail(): void {
        this.isEditingEmail = !this.isEditingEmail;
        this.toggleFormControl('email', this.isEditingEmail);
    }

    toggleFormControl(controlName: string, isEditing: boolean): void {
        const control = this.userForm.get(controlName);
        if (isEditing) {
            control?.enable();
        } else {
            control?.disable();
        }
    }

    saveUserEmail(): void {
        if (this.userForm.valid) {
            this.userProfileService.updateUserEmail(this.userForm.value).subscribe(() => {
                this.toggleEditEmail();
                this.userForm.get('email')?.markAsPristine();
                this.userForm.get('email')?.markAsUntouched();
            });
        }
    }

    saveUserName(): void {
        if (this.userForm.valid) {
            this.userProfileService.updateUserName(this.userForm.value).subscribe(() => {
                this.toggleEditName();
                this.userForm.get('name')?.markAsPristine();
                this.userForm.get('name')?.markAsUntouched();
            });
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
        if (this.passwordForm.valid) {
            const newPassword = this.passwordForm.get('newPassword')?.value;
            this.userProfileService.updatePassword(newPassword);
            this.closePasswordModal();
            this.passwordForm.reset();
        }
    }

    logout(): void {
        this.userProfileService.logout();
        this.router.navigate(['/']);
    }
}
