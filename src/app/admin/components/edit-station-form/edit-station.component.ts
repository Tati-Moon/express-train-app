import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

import { StationCreateFormFields } from '../../models/station-create-form';
import { ErrorMessageService } from '../../services/error-message.service';
import { StationsService } from '../../services/stations.service';
import { MapComponent } from '../map.component/map.component';

@Component({
    selector: 'app-edit-station',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        InputTextModule,
        ButtonModule,
        TranslateModule,
        MapComponent,
        DropdownModule,
    ],
    templateUrl: './edit-station.component.html',
    styleUrls: ['./edit-station.component.scss'],
})
export class EditStationComponent {
    @Input() stationForm!: FormGroup;
    @Output() save = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    get connectedTo(): FormArray {
        return this.stationForm.get(StationCreateFormFields.CONNECTED_TO) as FormArray;
    }

    get stations(): FormArray {
        return this.stationForm.get(StationCreateFormFields.STATIONS) as FormArray;
    }

    constructor(
        private stationService: StationsService,
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

    //  getAllStations(): void {
    //   this.stationService.getStations().subscribe((stations) => {
    //    this.stations = stations;
    //    console.log('!!!!getAllStations_this.stations', this.stations);
    // });
    //   }

    addConnectedTo(): void {
        this.connectedTo.push(
            this.fb.group({
                city: [''],
            })
        );
    }

    removeConnectedTo(index: number): void {
        this.connectedTo.removeAt(index);
    }

    onSaveStation(): void {
        if (this.stationForm.valid) {
            console.log('onSaveStation_this.stationForm', this.stationForm);
            // this.stationService.postStation(this.stationForm);
        }
    }

    onCancelEdit(): void {
        this.cancel.emit();
    }
}
