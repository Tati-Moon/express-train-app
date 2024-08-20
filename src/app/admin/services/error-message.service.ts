import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class ErrorMessageService {
    public getErrorMessages(errors: ValidationErrors | null): string[] {
        if (!errors) return [];

        const errorMessages: string[] = [];

        if (errors['required']) {
            errorMessages.push('ERRORS.REQUIRED');
        }

        if (errors['min']) {
            errorMessages.push('ERRORS.MIN');
        }
        if (errors['max']) {
            errorMessages.push('ERRORS.MAX');
        }

        return errorMessages;
    }
}
