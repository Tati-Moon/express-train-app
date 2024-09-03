import { CommonModule, NgStyle } from '@angular/common';
import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';

import { Carriage } from '../../../core/models/carriages/carriage.model';
import { Routers } from '../../../core/models/enums/routers';
import { RideDetails, SearchResult } from '../../../core/models/search/search-result.model';
import { Station } from '../../../core/models/station/station.model';
import { AppDatePipe } from '../../../core/pipes/date.pipe';
import { AppStationsActions } from '../../../redux/actions/app-station.actions';
import { selectCarriages } from '../../../redux/selectors/app-carriages.selector';
import { selectStations } from '../../../redux/selectors/app-stations.selector';
import { SearchFormFields } from '../../models/home.model';
import { HomeFormService } from '../../services/home-form.service';
import { SearchService } from '../../services/search.service';
import { SearchResultItemComponent } from '../search-result-item/search-result-item.component';

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
        SearchResultItemComponent,
        TabViewModule,
        AppDatePipe,
        ProgressSpinnerModule,
    ],
    templateUrl: './search-form.component.html',
    styleUrl: './search-form.component.scss',
})
export class SearchFormComponent implements OnInit {
    private store = inject(Store);
    public searchResults!: SearchResult | null;
    public allStations: Signal<Station[]> = signal([]);
    public allCarriages: Signal<Carriage[]> = signal([]);
    public selectedTabIndex: number = 0;
    public groupedResults: { [date: string]: RideDetails[] } = {};
    public minDate: Date | undefined;
    public maxDate: Date | undefined;
    public startSearch!: boolean | null;

    constructor(
        private router: Router,
        private searchService: SearchService,
        private homeFormService: HomeFormService
    ) {
        const allStations$ = this.store.select(selectStations);
        this.allStations = toSignal(allStations$, { initialValue: [] });

        const allCarriages$ = this.store.select(selectCarriages);
        this.allCarriages = toSignal(allCarriages$, { initialValue: [] });
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

        this.startSearch = false;
        this.groupedResults = {};
        this.minDate = undefined;
        this.maxDate = undefined;
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
                    this.searchResults = results;

                    const carriages = this.allCarriages();

                    const rideDetails = this.searchService.mapToRideDetails(
                        results.routes,
                        results.from.stationId,
                        results.to.stationId,
                        carriages
                    );

                    if (rideDetails.length === 0) {
                        this.router.navigate([Routers.NO_DIRECT_TRAINS_FOUND]);
                    } else {
                        rideDetails.forEach((result) => {
                            const dateStr = this.formatDate(result.date);
                            if (!this.groupedResults[dateStr]) {
                                this.groupedResults[dateStr] = [];
                            }
                            this.groupedResults[dateStr].push(result);
                            const currentDate = new Date(dateStr);
                            if (!this.minDate || currentDate < this.minDate) {
                                this.minDate = currentDate;
                            }
                            if (!this.maxDate || currentDate > this.maxDate) {
                                this.maxDate = currentDate;
                            }
                        });
                    }
                    this.startSearch = true;
                },
            });
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    }

    getSortedDates(): string[] {
        if (!this.minDate || !this.maxDate) {
            return [];
        }

        const dates = [];
        for (let date = new Date(this.minDate); date <= this.maxDate; date.setDate(date.getDate() + 1)) {
            const dateStr = date.toISOString().split('T')[0];
            dates.push(dateStr);
        }

        return dates;
    }
}
