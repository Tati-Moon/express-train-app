import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs';

import { AppUserState } from '../../redux/models/app-user-state.model';
import { AppUserFields } from '../../redux/models/state-fields';
import { selectAppUser } from '../../redux/selectors/app-user.selector';
import { AuthFormFields } from '../models/auth-form.model';
import { ValidationService } from './validation.service';

@Injectable({
    providedIn: 'root',
})
export class UserProfileService {
    private store = inject(Store);

    private MIN_LENGTH = 2;
    private MAX_LENGTH = 30;

    constructor(
        private fb: FormBuilder,
        private validationService: ValidationService
    ) {}

    public userProfileForm: FormGroup = this.fb.group({
        [AuthFormFields.NAME]: [
            '',
            [Validators.required, Validators.minLength(this.MIN_LENGTH), Validators.maxLength(this.MAX_LENGTH)],
        ],
        [AuthFormFields.LOGIN]: ['', [Validators.required, this.validationService.emailValidator()]],
        [AuthFormFields.PASSWORD]: ['', [Validators.required, this.validationService.strongPasswordValidator()]],
        [AuthFormFields.ROLE]: ['', []],
    });

    public userPasswordForm: FormGroup = this.fb.group({
        [AuthFormFields.PASSWORD]: ['', [Validators.required, this.validationService.strongPasswordValidator()]],
    });

    public getProfile(): void {
        this.store
            .select(selectAppUser)
            .pipe(
                map((state: AppUserState) => ({
                    name: state[AppUserFields.USER_NAME as keyof AppUserState] ?? '',
                    email: state[AppUserFields.USER_EMAIL as keyof AppUserState] ?? '',
                    role: state[AppUserFields.USER_ROLE as keyof AppUserState] ?? '',
                })),
                tap(({ name, email, role }) => {
                    this.userProfileForm.patchValue({
                        [AuthFormFields.NAME]: name,
                        [AuthFormFields.LOGIN]: email,
                        [AuthFormFields.ROLE]: role,
                    });
                })
            )
            .subscribe();
    }

    public markFormDirty(form: FormGroup): void {
        const { controls } = form;

        Object.keys(controls).forEach((control: string) => {
            form.get(control)?.markAsDirty();
        });
    }
}
