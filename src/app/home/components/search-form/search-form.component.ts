import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

import { Carriage } from '../../../core/models/carriages/carriage.model';
import { Routers } from '../../../core/models/enums/routers';
import { RideDetails, SearchResult } from '../../../core/models/search/search-result.model';
import { Station } from '../../../core/models/station/station.model';
import { AppSearchActions } from '../../../redux/actions/app-search.actions';
import { selectCarriages } from '../../../redux/selectors/app-carriages.selector';
import { selectStations } from '../../../redux/selectors/app-stations.selector';
import { SearchFormFields } from '../../models/home.model';
import { HomeFormService } from '../../services/home-form.service';
import { SearchService } from '../../services/search.service';

@Component({
    selector: 'app-search-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DropdownModule,
        TranslateModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        CalendarModule,
    ],
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit {
    @Output() searchCompleted = new EventEmitter<boolean>();
    @Output() valueChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
    private store = inject(Store);
    public searchResults!: SearchResult | null;
    public allStations: Signal<Station[]> = signal([]);
    public allCarriages: Signal<Carriage[]> = signal([]);
    public selectedTabIndex: number = 0;
    public groupedResults: { [date: string]: RideDetails[] } = {};
    public minDate: Date | undefined;
    public maxDate: Date | undefined;
    public startSearch!: boolean | null;
    public currentDate: Date = new Date();

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
        this.store.dispatch(AppSearchActions.loadSearchData());
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
        this.valueChanged.emit(this.startSearch);
        this.groupedResults = {};
        this.minDate = undefined;
        this.maxDate = undefined;
        const fromCity = this.form.get([this.fields.FROM_CITY])?.value;
        const toCity = this.form.get([this.fields.TO_CITY])?.value;
        const date = this.form.get([this.fields.DATE])?.value;
        const time = this.form.get([this.fields.TIME])?.value;
        const combinedDateTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            time?.getHours() ?? 0,
            time?.getMinutes() ?? 0,
            time?.getSeconds() ?? 0
        );

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

                    const rideDetails = this.searchService
                        .mapToRideDetails(results.routes, results.from.stationId, results.to.stationId, carriages)
                        .filter((ride) => {
                            const rideDateObj = new Date(ride.date);
                            return rideDateObj >= combinedDateTime;
                        });

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
                    this.searchCompleted.emit(this.startSearch);
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
        return Object.keys(this.groupedResults).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    }
}
