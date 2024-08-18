import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class ErrorMessageService {
    public getLoginErrorMessages(errors: ValidationErrors | null): string[] {
        if (!errors) return [];

        const errorMessages: string[] = [];

        if (errors['required']) {
            errorMessages.push('ERRORS.REQUIRED');
        }
        if (errors['invalidEmail']) {
            errorMessages.push('ERRORS.INVALID_EMAIL');
        }

        return errorMessages;
    }

    public getPasswordErrorMessages(errors: ValidationErrors | null): string[] {
        if (!errors) return [];

        const errorMessages: string[] = [];

        if (errors['required']) {
            errorMessages.push('ERRORS.REQUIRED');
        }
        if (errors['hasUpperLowerCase']) {
            errorMessages.push('ERRORS.PASSWORD_UPPER_LOWER');
        }
        if (errors['hasNumeric']) {
            errorMessages.push('ERRORS.PASSWORD_NUMERIC');
        }
        if (errors['hasSpecialChar']) {
            errorMessages.push('ERRORS.PASSWORD_SPECIAL_CHAR');
        }
        if (errors['hasMinLength']) {
            errorMessages.push('ERRORS.PASSWORD_MIN_LENGTH');
        }
        if (errors['matchPassword']) {
            errorMessages.push('ERRORS.PASSWORD_MISMATCH');
        }

        return errorMessages;
    }
}
