import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { AuthFormFields, LoginForm } from '../models/auth-form.model';
import { ValidationService } from './validation.service';

@Injectable({
    providedIn: 'root',
})
export class LoginFormService {
    constructor(
        private fb: FormBuilder,
        private validationService: ValidationService
    ) {}

    public loginForm: FormGroup = this.fb.group<LoginForm>({
        [AuthFormFields.LOGIN]: ['', [Validators.required, this.validationService.emailValidator()]],
        [AuthFormFields.PASSWORD]: ['', [this.stupidRequired()]],
    });

    public markFormDirty(form: FormGroup): void {
        const { controls } = form;

        Object.keys(controls).forEach((control: string) => {
            form.get(control)?.markAsDirty();
        });
    }

    private stupidRequired(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const trimmedValue = control?.value?.replace(/\s/g, '');

            if ((trimmedValue?.length ?? 0) < 1) {
                return { required: true };
            }

            return null;
        };
    }
}
