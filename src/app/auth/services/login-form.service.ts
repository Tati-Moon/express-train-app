import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
        [AuthFormFields.PASSWORD]: ['', [Validators.required]],
        [AuthFormFields.REMEMBER_ME]: [false, []],
    });

    public markFormDirty(form: FormGroup): void {
        const { controls } = form;

        Object.keys(controls).forEach((control: string) => {
            form.get(control)?.markAsDirty();
        });
    }
}
