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
import { AppStationsActions } from '../../../redux/actions/app-station.actions';
import {
    selectCurrentPage,
    selectPageSize,
    selectPaginatedStations,
    selectStations,
    selectTotalRecords,
} from '../../../redux/selectors/app-stations.selector';
import { selectColorScheme } from '../../../redux/selectors/app-theme.selector';
import { DeleteConfirmationComponent } from '../../components/delete-confirmation/delete-confirmation.component';
import { PageInfoListComponent } from '../../components/page-info-list/page-info-list.component';
import { CreateStationComponent } from '../../components/station-create-form/station-create-form.component';
import { ViewStationComponent } from '../../components/station-view-form/station-view-form.component';
import { IStation } from '../../models/station.interface';
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
        CreateStationComponent,
        ViewStationComponent,
        TagModule,
        PaginatorModule,
        PageInfoListComponent,
        DeleteConfirmationComponent,
    ],
    templateUrl: './stations.component.html',
    styleUrls: ['./stations.component.scss'],
})
export class StationsComponent implements OnInit {
    private store = inject(Store);
    public colorScheme!: Signal<string>;
    public isCreateStation = false;
    public isEditStation = false;
    public stations!: Signal<Station[]>;
    public allStations!: Signal<Station[]>;
    public selectedStation: Station | null = null;
    public totalItems: Signal<number>;
    public currentPage: Signal<number>;
    public pageSize: Signal<number>;
    public deleteModalVisible: boolean = false;
    public stationToDelete!: number;

    constructor(
        private stationService: StationsService,
        private fb: FormBuilder
    ) {
        const colorScheme$ = this.store.select(selectColorScheme);
        this.colorScheme = toSignal(colorScheme$, { initialValue: Schemes.LIGHT });
        const allStations$ = this.store.select(selectStations);
        this.allStations = toSignal(allStations$, { initialValue: [] });
        const stations$ = this.store.select(selectPaginatedStations);
        this.stations = toSignal(stations$, { initialValue: [] });
        this.totalItems = toSignal(this.store.select(selectTotalRecords), { initialValue: 0 });
        this.currentPage = toSignal(this.store.select(selectCurrentPage), { initialValue: 0 });
        this.pageSize = toSignal(this.store.select(selectPageSize), { initialValue: 10 });
    }

    public get stationForm() {
        return this.stationService.stationCreateForm;
    }

    ngOnInit(): void {
        this.getAllItems();
    }

    getAllItems(): void {
        this.store.dispatch(AppStationsActions.loadStations());
    }

    onPageChange(event: PaginatorState): void {
        this.store.dispatch(
            AppStationsActions.changePagination({ currentPage: event.page ?? 0, pageSize: event.rows ?? 10 })
        );
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
                    city: item.city,
                })
            );
        });
    }

    createStationsFormArray(): void {
        const stations = this.stationForm.get(StationCreateFormFields.STATIONS);
        const stationsArray: IStation[] = this.allStations().map((item) => {
            return { id: item.id, city: item.city, latitude: item.latitude, longitude: item.longitude };
        });
        stations?.setValue(stationsArray);
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

    onSaveStation(station: Station): void {
        if (station?.id != null && station?.id > 0) {
            this.store.dispatch(AppStationsActions.initUpdateStation({ station }));
        } else {
            this.store.dispatch(AppStationsActions.initSaveNewStation({ station }));
        }

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
        this.stationToDelete = id;
        this.deleteModalVisible = true;
    }

    onConfirmDelete(id: number): void {
        this.store.dispatch(AppStationsActions.initDeleteStation({ id }));
        this.deleteModalVisible = false;
    }

    onCancelDelete(): void {
        this.deleteModalVisible = false;
        this.stationToDelete = null!;
    }
}
