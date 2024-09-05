import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SearchForm, SearchFormFields } from '../models/home.model';

@Injectable({
    providedIn: 'root',
})
export class HomeFormService {
    constructor(private fb: FormBuilder) {}

    public searchForm: FormGroup = this.fb.group<SearchForm>({
        [SearchFormFields.FROM_CITY]: ['', [Validators.required]],
        [SearchFormFields.TO_CITY]: ['', [Validators.required]],
        [SearchFormFields.DATE]: [null, [Validators.required]],
        [SearchFormFields.TIME]: [null, []],
    });

    public markFormDirty(form: FormGroup): void {
        const { controls } = form;

        Object.keys(controls).forEach((control: string) => {
            form.get(control)?.markAsDirty();
        });
    }
}
