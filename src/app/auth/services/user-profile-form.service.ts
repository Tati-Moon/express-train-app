import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthFormFields } from '../models/auth-form.model';
import { ValidationService } from './validation.service';

@Injectable({
    providedIn: 'root',
})
export class UserProfileService {
    private testUserLogin = 'john.doe@example.com';
    private testUserName = 'John Doe';
    private testUserRole = 'Manager';
    private testUserPassword = 'SomeTestPassword_123';

    private MIN_LENGTH = 2;
    private MAX_LENGTH = 30;

    constructor(
        private fb: FormBuilder,
        private validationService: ValidationService
    ) {}

    public userProfileForm: FormGroup = this.fb.group({
        [AuthFormFields.NAME]: [
            '',
            [Validators.required, Validators.minLength(this.MIN_LENGTH), Validators.maxLength(this.MAX_LENGTH)],
        ],
        [AuthFormFields.LOGIN]: ['', [Validators.required, this.validationService.emailValidator()]],
        [AuthFormFields.PASSWORD]: ['', [Validators.required, this.validationService.strongPasswordValidator()]],
        [AuthFormFields.ROLE]: ['', []],
    });

    public userPasswordForm: FormGroup = this.fb.group({
        [AuthFormFields.PASSWORD]: ['', [Validators.required, this.validationService.strongPasswordValidator()]],
    });

    public getProfile(): void {
        this.userProfileForm?.patchValue({
            [AuthFormFields.NAME]: this.testUserName,
            [AuthFormFields.LOGIN]: this.testUserLogin,
            [AuthFormFields.PASSWORD]: this.testUserPassword,
            [AuthFormFields.ROLE]: this.testUserRole,
        });
    }

    updateUserName(name: string): void {
        this.userProfileForm?.patchValue({
            [AuthFormFields.NAME]: name,
        });
    }

    updateUserEmail(email: string): void {
        this.userProfileForm?.patchValue({
            [AuthFormFields.LOGIN]: email,
        });
    }

    updatePassword(newPassword: string): void {
        this.userProfileForm?.patchValue({
            [AuthFormFields.PASSWORD]: newPassword,
        });
    }

    logout(): void {
        console.log('User logged out');
    }

    public markFormDirty(form: FormGroup): void {
        const { controls } = form;

        Object.keys(controls).forEach((control: string) => {
            form.get(control)?.markAsDirty();
        });
    }
}
