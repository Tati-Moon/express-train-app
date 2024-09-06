import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { AuthFormFields, RegisterForm } from '../models/auth-form.model';
import { ValidationService } from './validation.service';

@Injectable({
    providedIn: 'root',
})
export class RegisterFormService {
    constructor(
        private fb: FormBuilder,
        private validationService: ValidationService
    ) {}

    public registerForm: FormGroup = this.fb.group<RegisterForm>({
        [AuthFormFields.LOGIN]: ['', [Validators.required, this.validationService.emailValidator()]],
        [AuthFormFields.PASSWORD]: [
            '',
            [Validators.required, this.minLengthWithoutSpaces(8), this.matchPasswordValidators()],
        ],
        [AuthFormFields.REPEAT_PASSWORD]: ['', [Validators.required, this.matchPasswordValidators()]],
    });

    private matchPasswordValidators(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const { value } = control;

            if (!value) {
                return null;
            }

            const password = this.registerForm?.get(AuthFormFields.PASSWORD)?.value;
            const confirmPassword = control.value;

            if (password !== confirmPassword) {
                return { matchPassword: true };
            }
            return null;
        };
    }

    private minLengthWithoutSpaces(minLength: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }

            const trimmedValue = control.value.replace(/\s/g, '');

            if (trimmedValue.length < minLength) {
                return { hasMinLength: { requiredLength: minLength, actualLength: trimmedValue.length } };
            }

            return null;
        };
    }

    public markFormDirty(form: FormGroup): void {
        const { controls } = form;

        Object.keys(controls).forEach((control: string) => {
            form.get(control)?.markAsDirty();
        });
    }
}
