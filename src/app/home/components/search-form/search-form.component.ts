import { CommonModule, NgStyle } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

import { SearchService } from '../../../admin/services/search.service';
import { SearchResult } from '../../../core/models/search/search-result.model';
import { Station } from '../../../core/models/station/station.model';
import { AppStationsActions } from '../../../redux/actions/app-station.actions';
import { selectStations } from '../../../redux/selectors/app-stations.selector';
import { SearchFormFields } from '../../models/home.model';
import { HomeFormService } from '../../services/home-form.service';

@Component({
    selector: 'app-search-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DropdownModule,
        TranslateModule,
        ReactiveFormsModule,
        NgStyle,
        InputTextModule,
        ButtonModule,
        CalendarModule,
    ],
    templateUrl: './search-form.component.html',
    styleUrl: './search-form.component.scss',
})
export class SearchFormComponent implements OnInit {
    private store = inject(Store);
    public searchResults!: SearchResult | null;
    public allStations!: Signal<Station[]>;
    public selectedCity: Station | undefined;

    public minDate = new Date();

    public errorMessage: string | null = null;
    constructor(
        private searchService: SearchService,
        private homeFormService: HomeFormService
    ) {
        const allStations$ = this.store.select(selectStations);
        this.allStations = toSignal(allStations$, { initialValue: [] });
    }

    ngOnInit(): void {
        this.getAllItems();
    }

    getAllItems(): void {
        this.store.dispatch(AppStationsActions.lazyLoadStations());
    }

    public get form() {
        return this.homeFormService.searchForm;
    }

    public get fields() {
        return SearchFormFields;
    }

    getStationCities(): { name: string; code: string }[] | undefined {
        const stations = this.allStations();
        if (stations) {
            const field = stations.map((station) => {
                return { ...station, name: station.city, code: station.city };
            });
            return field;
        }
        return undefined;
    }

    public reverseInputs() {
        if (this.form.get([this.fields.FROM_CITY])?.valid && this.form.get([this.fields.TO_CITY])?.valid) {
            const formValue = this.form.value;
            [{ ...formValue.from_city }, { ...formValue.to_city }] = [
                { ...formValue.to_city },
                { ...formValue.from_city },
            ];
            this.form.patchValue({
                [this.fields.FROM_CITY]: { ...formValue.from_city },
                [this.fields.TO_CITY]: { ...formValue.to_city },
            });
        }
    }

    public onSearch(): void {
        if (!this.form.valid) {
            this.homeFormService.markFormDirty(this.form);
            return;
        }

        const fromCity = this.form.get([this.fields.FROM_CITY])?.value;
        const toCity = this.form.get([this.fields.TO_CITY])?.value;
        const date = this.form.get([this.fields.DATE])?.value;

        this.searchService
            .search({
                fromLatitude: fromCity.latitude,
                fromLongitude: fromCity.longitude,
                toLatitude: toCity.latitude,
                toLongitude: toCity.longitude,
                date,
            })
            .subscribe({
                next: (results) => {
                    console.log('search_results', results);
                    this.searchResults = results;
                    this.errorMessage = null;
                },
            });
    }
}
