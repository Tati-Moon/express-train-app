import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CarriageCreateForm, CarriageCreateFormFields } from '../models/carriage-create-form.model';

@Injectable({
    providedIn: 'root',
})
export class CarriageCreateFormService {
    constructor(private fb: FormBuilder) {}

    public carriageCreateForm: FormGroup = this.fb.group<CarriageCreateForm>({
        [CarriageCreateFormFields.CODE]: ['', [Validators.required]],
        [CarriageCreateFormFields.NAME]: ['Car', [Validators.required]],
        [CarriageCreateFormFields.ROWS]: [16, [Validators.required, Validators.min(1), Validators.max(100)]],
        [CarriageCreateFormFields.LEFT_SEATS]: [2, [Validators.required, Validators.min(1), Validators.max(100)]],
        [CarriageCreateFormFields.RIGHT_SEATS]: [3, [Validators.required, Validators.min(1), Validators.max(100)]],
    });

    public markFormDirty(form: FormGroup): void {
        const { controls } = form;

        Object.keys(controls).forEach((control: string) => {
            form.get(control)?.markAsDirty();
        });
    }
}
