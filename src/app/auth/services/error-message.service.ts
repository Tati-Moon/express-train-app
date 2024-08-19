import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class ErrorMessageService {
    public getNameErrorMessages(errors: ValidationErrors | null): string[] {
        if (!errors) return [];

        const errorMessages: string[] = [];

        if (errors['required']) {
            errorMessages.push('ERRORS.REQUIRED');
        }
        if (errors['hasMinLength']) {
            errorMessages.push('ERRORS.NAME_MIN_LENGTH');
        }
        if (errors['hasMaxLength']) {
            errorMessages.push('ERRORS.NAME_MAX_LENGTH');
        }

        return errorMessages;
    }

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
        if (errors['hasLowerCase']) {
            errorMessages.push('ERRORS.PASSWORD_LOWER');
        }
        if (errors['hasUpperCase']) {
            errorMessages.push('ERRORS.PASSWORD_UPPER');
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
        if (errors['hasMaxLength']) {
            errorMessages.push('ERRORS.PASSWORD_MAX_LENGTH');
        }
        if (errors['matchPassword']) {
            errorMessages.push('ERRORS.PASSWORD_MISMATCH');
        }

        return errorMessages;
    }
}
