import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';

import { Schemes } from '../../../core/models/enums/constants';
import { Station } from '../../../core/models/station/station.model';
import { selectColorScheme } from '../../../redux/selectors/app-theme.selector';
import { EditStationComponent } from '../../components/edit-station-form/edit-station.component';
import { StationCreateFormFields } from '../../models/station-create-form';
import { StationsService } from '../../services/stations.service';

const INITIAL_LATITUDE = 51.505;
const INITIAL_LONGITUDE = -0.09;

@Component({
    selector: 'app-stations',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        InputTextModule,
        ButtonModule,
        TranslateModule,
        EditStationComponent,
        TagModule,
        PaginatorModule,
    ],
    templateUrl: './stations.component.html',
    styleUrls: ['./stations.component.scss'],
})
export class StationsComponent implements OnInit {
    private store = inject(Store);
    public colorScheme!: Signal<string>;
    public isCreateStation = false;
    public isEditStation = false;
    public stations!: Station[];
    public paginatedStations!: Station[];
    public selectedStation: Station | null = null;
    public first = 0;
    public rows = 10;
    public totalRecords = 0;

    constructor(
        private stationService: StationsService,
        private fb: FormBuilder
    ) {
        const colorScheme$ = this.store.select(selectColorScheme);
        this.colorScheme = toSignal(colorScheme$, { initialValue: Schemes.LIGHT });
    }

    public get stationForm() {
        return this.stationService.stationCreateForm;
    }

    ngOnInit(): void {
        this.getAllStations();
    }

    getAllStations(): void {
        this.stationService.getStations().subscribe((stations) => {
            this.stations = stations;
            this.totalRecords = stations.length;
            this.paginate();
        });
    }

    onPageChange(event: PaginatorState): void {
        this.first = event.first ?? 0;
        this.rows = event.rows ?? 10;
        this.paginate();
    }

    paginate(): void {
        const start = this.first;
        const end = this.first + this.rows;
        this.paginatedStations = this.stations.slice(start, end);
    }

    onAddNewStation(): void {
        this.isCreateStation = true;
        this.isEditStation = false;

        this.stationForm.reset();
        this.stationForm.patchValue({
            latitude: INITIAL_LATITUDE,
            longitude: INITIAL_LONGITUDE,
            city: 'test city name',
            connectedTo: [],
            id: 0,
        });

        this.createStationsFormArray();
        this.createConnectedFormArray(null);
    }

    createConnectedFormArray(selectedStation: Station | null = null) {
        const connectedToArray = this.stationForm.get(StationCreateFormFields.CONNECTED_TO) as FormArray;
        connectedToArray.clear();
        selectedStation?.connectedTo?.forEach((item) => {
            connectedToArray.push(
                this.fb.group({
                    id: item.id,
                    city: item.city,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    distance: item.distance,
                })
            );
        });
    }

    createStationsFormArray(): void {
        const stationsToArray = this.stationForm.get(StationCreateFormFields.STATIONS) as FormArray;
        stationsToArray.clear();
        this.stations.forEach((item) => {
            stationsToArray.push(
                this.fb.group({
                    id: item.id,
                    city: item.city,
                    latitude: item.latitude,
                    longitude: item.longitude,
                })
            );
        });
    }

    onSelectStation(station: Station): void {
        this.isCreateStation = false;
        this.isEditStation = true;
        this.selectedStation = { ...station };

        this.stationForm.patchValue({
            city: this.selectedStation.city,
            latitude: this.selectedStation.latitude,
            longitude: this.selectedStation.longitude,
            id: this.selectedStation.id,
        });

        this.createStationsFormArray();
        this.createConnectedFormArray(this.selectedStation);
    }

    onSaveStation(): void {
        this.onCancelEdit();
        this.isEditStation = false;
        this.isCreateStation = false;
    }

    onCancelEdit(): void {
        this.selectedStation = null;
        this.isEditStation = false;
        this.isCreateStation = false;
        this.stationForm.reset();
    }

    onDeleteStation(id: number): void {
        this.stationService.deleteStation(id).subscribe(() => {
            this.getAllStations();
        });
    }
}
