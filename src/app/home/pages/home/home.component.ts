import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';

import { SearchService } from '../../../admin/services/search.service';
import { SearchResult } from '../../../core/models/search/search-result.model';
import { Station } from '../../../core/models/station/station.model';
import { AppStationsActions } from '../../../redux/actions/app-station.actions';
import { selectStations } from '../../../redux/selectors/app-stations.selector';
import { SearchFormFields } from '../../models/home.model';
import { HomeFormService } from '../../services/home-form.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, FormsModule, DropdownModule, TranslateModule, ReactiveFormsModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
    private store = inject(Store);
    public searchResults!: SearchResult | null;
    public allStations!: Signal<Station[]>;
    selectedCity: Station | undefined;

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

    public onSearch(): void {
        if (!this.form.valid) {
            this.homeFormService.markFormDirty(this.form);
            return;
        }

        const fromCity = this.form.get([this.fields.FROM_CITY])?.value;
        const toCity = this.form.get([this.fields.TO_CITY])?.value;

        this.searchService
            .search({
                fromLatitude: fromCity.latitude,
                fromLongitude: fromCity.longitude,
                toLatitude: toCity.latitude,
                toLongitude: toCity.longitude,
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
