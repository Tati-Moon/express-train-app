import { AbstractControl, ValidationErrors } from '@angular/forms';

export function notEmptyArrayValidator(control: AbstractControl): ValidationErrors | null {
    const { value } = control;
    if (Array.isArray(value) && value.length === 0) {
        return { emptyArray: true };
    }
    return null;
}
