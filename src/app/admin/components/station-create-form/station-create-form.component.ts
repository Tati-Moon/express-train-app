import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';

import { Connected, Station } from '../../../core/models/station/station.model';
import { IStation } from '../../models/station.interface';
import { StationCreateFormFields, StationFormMode } from '../../models/station-create-form';
import { ErrorMessageService } from '../../services/error-message.service';
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
    @Input() public mode: StationFormMode = null;
    @Input() stationForm!: FormGroup;
    @Output() save = new EventEmitter<Station>();
    @Output() cancel = new EventEmitter<void>();

    ngOnInit(): void {
        this.stationForm.enable();
    }

    get connectedTo(): FormArray {
        return this.stationForm.controls[StationCreateFormFields.CONNECTED_TO] as FormArray;
    }

    get stations(): IStation[] {
        return this.stationForm.controls[StationCreateFormFields.STATIONS]?.value;
    }

    constructor(
        private errorMessageService: ErrorMessageService,
        private fb: FormBuilder
    ) {}

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
            const city = this.stationForm.get([this.fields.CITY])?.value;
            const latitude = this.stationForm.get([this.fields.LATITUDE])?.value;
            const longitude = this.stationForm.get([this.fields.LONGITUDE])?.value;
            const connectedTo: Connected[] = this.stationForm.get([this.fields.CONNECTED_TO])?.value;
            const relations = connectedTo
                .map((connection: Connected) => {
                    const matchingStation = this.stations.find((station) => station.city === connection.city);
                    return matchingStation ? matchingStation.id : null;
                })
                .filter((id_): id_ is number => id !== null);

            this.save.emit({ id, city, latitude, longitude, connectedTo, relations, cities: [] });
        }
    }

    onCancelEdit(): void {
        this.cancel.emit();
    }
}
