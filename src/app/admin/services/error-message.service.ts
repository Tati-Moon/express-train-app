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

    public getCityNameErrorMessages(errors: ValidationErrors | null): string[] {
        if (!errors) return [];

        const errorMessages: string[] = [];

        if (errors['required']) {
            errorMessages.push('STATION_PAGE.FIELDS.CITY_NAME.ERRORS.REQUIRED');
        }
        if (errors['hasMinLength']) {
            errorMessages.push('STATION_PAGE.FIELDS.CITY_NAME.ERRORS.MIN_LENGTH');
        }
        if (errors['hasMaxLength']) {
            errorMessages.push('STATION_PAGE.FIELDS.CITY_NAME.ERRORS.MAX_LENGTH');
        }

        return errorMessages;
    }

    public getLatitudeErrorMessages(errors: ValidationErrors | null): string[] {
        if (!errors) return [];

        const errorMessages: string[] = [];

        if (errors['required']) {
            errorMessages.push('STATION_PAGE.FIELDS.LATITUDE.ERRORS.REQUIRED');
        }
        if (errors['hasMinLength'] || errors['hasMaxLength']) {
            errorMessages.push('STATION_PAGE.FIELDS.LATITUDE.ERRORS.MIN_MAX');
        }

        return errorMessages;
    }

    public getLongitudeErrorMessages(errors: ValidationErrors | null): string[] {
        if (!errors) return [];

        const errorMessages: string[] = [];

        if (errors['required']) {
            errorMessages.push('STATION_PAGE.FIELDS.LONGITUDE.ERRORS.REQUIRED');
        }
        if (errors['hasMinLength'] || errors['hasMaxLength']) {
            errorMessages.push('STATION_PAGE.FIELDS.LONGITUDE.ERRORS.MIN_MAX');
        }

        return errorMessages;
    }
}
