import { NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';

import { SearchForm, SearchFormFields } from './models/search-form.models';

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [InputTextModule, ReactiveFormsModule, NgStyle, ButtonModule, CalendarModule],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
})
export class SearchComponent {
    private store = inject(Store); //

    public minDate = new Date();

    constructor(private fb: FormBuilder) {}

    public get fields() {
        return SearchFormFields;
    }

    public searchForm: FormGroup = this.fb.group<SearchForm>({
        [this.fields.FROM_INPUT]: ['', [Validators.required]],
        [this.fields.TO_INPUT]: ['', [Validators.required]],
        [this.fields.CALENDER]: [new Date(), [Validators.required]],
    });

    public reverseInputs() {
        const formValue = this.searchForm.value;
        [formValue.from, formValue.to] = [formValue.to, formValue.from];
        this.searchForm.patchValue({
            [this.fields.FROM_INPUT]: [formValue.from],
            [this.fields.TO_INPUT]: [formValue.to],
        });
    }

    public onSearch() {
        console.log('Search...');
    }
}
