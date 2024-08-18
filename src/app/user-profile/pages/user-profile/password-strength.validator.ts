import { AbstractControl, ValidationErrors } from '@angular/forms';

export class PasswordStrengthValidator {
    static strong(control: AbstractControl): ValidationErrors | null {
        const { value } = control;

        if (!value.trim()) {
            return {
                strong: 'Input value is empty',
            };
        }

        const hasMinLength = value.length >= 8;
        const hasUpperCase = /[A-Z]+/.test(value);
        const hasLowerCase = /[a-z]+/.test(value);
        const hasNumeric = /[0-9]+/.test(value);
        const hasSpecial = /[!@#?+_]+/.test(value);
        const hasMaxLength = value.length < 30;

        const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumeric && hasSpecial && hasMaxLength;

        if (!isValid) {
            return {
                strong:
                    'Your password is not strong enough. It must be at least 8 characters ' +
                    'long and include a combination of uppercase letters, lowercase letters, ' +
                    'numbers, and special characters (!@#?+_). ' +
                    'Additionally, it must not exceed 30 characters in length.',
            };
        }

        return null;
    }
}
