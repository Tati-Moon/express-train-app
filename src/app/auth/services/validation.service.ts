import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class ValidationService {
    public emailValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const { value } = control;

            if (!value) {
                return null;
            }

            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(value)) {
                return { invalidEmail: true };
            }

            return null;
        };
    }

    public strongPasswordValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const { value } = control;
            const errors: ValidationErrors = {};

            if (!value) {
                return null;
            }

            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasNumeric = /[0-9]/.test(value);
            const hasSpecialChar = /[!@#?_]/.test(value);
            const hasMinLength = value.length >= 8;
            const hasMaxLength = value.length < 31;

            if (!hasUpperCase) {
                errors['hasUpperCase'] = true;
            }
            if (!hasLowerCase) {
                errors['hasLowerCase'] = true;
            }
            if (!hasNumeric) {
                errors['hasNumeric'] = true;
            }
            if (!hasSpecialChar) {
                errors['hasSpecialChar'] = true;
            }
            if (!hasMinLength) {
                errors['hasMinLength'] = true;
            }
            if (!hasMaxLength) {
                errors['hasMaxLength'] = true;
            }

            return Object.keys(errors).length > 0 ? errors : null;
        };
    }
}
