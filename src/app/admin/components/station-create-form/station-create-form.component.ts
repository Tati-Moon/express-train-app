import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';

import { Connected, Station } from '../../../core/models/station/station.model';
import { AppStationsActions } from '../../../redux/actions/app-station.actions';
import { selectStations } from '../../../redux/selectors/app-stations.selector';
import { StationCreateFormFields, StationFormMode } from '../../models/station-create-form';
import { ErrorMessageService } from '../../services/error-message.service';
import { StationsService } from '../../services/stations.service';
import { MapViewComponent } from '../map-view/map-view.component';

@Component({
    selector: 'app-create-station',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        InputTextModule,
        ButtonModule,
        TranslateModule,
        MapViewComponent,
        DropdownModule,
        MessagesModule,
    ],
    templateUrl: './station-create-form.component.html',
    styleUrls: ['./station-create-form.component.scss'],
})
export class CreateStationComponent implements OnInit {
    private INITIAL_LATITUDE = 51.505;
    private INITIAL_LONGITUDE = -0.09;
    private store = inject(Store);

    @Input() public mode: StationFormMode = null;
    @Output() save = new EventEmitter<Station>();
    @Output() cancel = new EventEmitter<void>();

    public allStations!: Signal<Station[]>;

    constructor(
        private errorMessageService: ErrorMessageService,
        private stationsService: StationsService,
        private fb: FormBuilder
    ) {
        const allStations$ = this.store.select(selectStations);
        this.allStations = toSignal(allStations$, { initialValue: [] });
    }

    public get stationForm() {
        return this.stationsService.stationCreateForm;
    }

    ngOnInit(): void {
        window.addEventListener('markerDragged', this.onMarkerDragged.bind(this));

        this.stationForm.enable();

        this.stationForm.reset();
        this.stationForm.patchValue({
            id: 0,
            city: '',
            connectedTo: [],
            latitude: this.INITIAL_LATITUDE,
            longitude: this.INITIAL_LONGITUDE,
        });

        this.createConnectedFormArray();
    }

    getStationsWithoutSelected(index: number) {
        const connectedArray = this.connectedTo.value;
        const allStations = this.allStations();
        const selectedCities = connectedArray
            .filter((_: Station, i: number) => i !== index)
            .map((item: Station) => item.city);

        const availableStations = allStations.filter((station) => !selectedCities.includes(station.city));

        return availableStations;
    }

    createConnectedFormArray() {
        this.connectedTo.enable();
        this.connectedTo.clear();
    }

    onMarkerDragged(event: Event): void {
        const customEvent = event as CustomEvent<{ latitude: number; longitude: number }>;
        const { latitude, longitude } = customEvent.detail;

        this.stationForm.patchValue({
            [this.fields.LATITUDE]: latitude,
            [this.fields.LONGITUDE]: longitude,
        });
    }

    get connectedTo(): FormArray {
        return this.stationForm.controls[StationCreateFormFields.CONNECTED_TO] as FormArray;
    }

    get city(): string {
        return this.stationForm.controls[StationCreateFormFields.CITY].value as string;
    }

    get longitude(): number {
        return this.stationForm.controls[StationCreateFormFields.LONGITUDE].value as number;
    }

    get latitude(): number {
        return this.stationForm.controls[StationCreateFormFields.LATITUDE].value as number;
    }

    public handleCityNameErrorMessages(errors: ValidationErrors | null): string[] {
        return this.errorMessageService.getCityNameErrorMessages(errors);
    }

    public handleLatitudeErrorMessages(errors: ValidationErrors | null): string[] {
        return this.errorMessageService.getLatitudeErrorMessages(errors);
    }

    public handleLongitudeErrorMessages(errors: ValidationErrors | null): string[] {
        return this.errorMessageService.getLongitudeErrorMessages(errors);
    }

    public get fields() {
        return StationCreateFormFields;
    }

    addConnectedTo(): void {
        this.connectedTo.push(
            this.fb.group({
                [StationCreateFormFields.CITY]: [''],
            })
        );
    }

    removeConnectedTo(index: number): void {
        this.connectedTo.removeAt(index);
    }

    onSaveStation(): void {
        if (this.stationForm.valid) {
            const id = this.stationForm.get([this.fields.ID])?.value;
            const connectedTo: Connected[] = this.connectedTo?.value;
            const relations = connectedTo
                .map((connection: Connected) => {
                    const matchingStation = this.allStations().find((station) => station.city === connection.city);
                    return matchingStation ? matchingStation.id : null;
                })
                .filter((id_): id_ is number => id !== null);

            const cities: string[] = connectedTo.map((item) => item.city);

            const station = {
                id,
                city: this.city,
                latitude: this.latitude,
                longitude: this.longitude,
                connectedTo,
                relations,
                cities,
            };

            if (station?.id != null && station?.id > 0) {
                this.store.dispatch(AppStationsActions.initUpdateStation({ station }));
            } else {
                this.store.dispatch(AppStationsActions.initSaveNewStation({ station }));
            }

            this.save.emit();
        }
    }

    onCancelEdit(): void {
        this.stationForm.reset();
        this.cancel.emit();
    }
}
