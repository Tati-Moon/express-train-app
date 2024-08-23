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
    imports: [InputTextModule, ReactiveFormsModule, ButtonModule, CalendarModule],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
})
export class SearchComponent {
    private store = inject(Store); //

    constructor(private fb: FormBuilder) {}

    public get fields() {
        return SearchFormFields;
    }

    public searchForm: FormGroup = this.fb.group<SearchForm>({
        [this.fields.FROM_INPUT]: ['', [Validators.required]],
        [this.fields.TO_INPUT]: ['', [Validators.required]],
        [this.fields.CALENDER]: [new Date(), [Validators.required]],
    });

    onSearch() {
        console.log('Search...');
    }
}
