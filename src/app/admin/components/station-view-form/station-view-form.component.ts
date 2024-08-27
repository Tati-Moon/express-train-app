import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

import { IStation } from '../../models/station.interface';
import { StationCreateFormFields, StationFormMode } from '../../models/station-create-form';
import { ErrorMessageService } from '../../services/error-message.service';
import { MapComponent } from '../map.component/map.component';

@Component({
    selector: 'app-view-station',
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
    templateUrl: './station-view-form.component.html',
    styleUrls: ['./station-view-form.component.scss'],
})
export class ViewStationComponent implements OnInit {
    @Input() public mode: StationFormMode = null;
    @Input() stationForm!: FormGroup;
    @Output() cancel = new EventEmitter<void>();

    constructor(
        private errorMessageService: ErrorMessageService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.stationForm.disable();
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

    get connectedTo(): FormArray {
        return this.stationForm.controls[StationCreateFormFields.CONNECTED_TO] as FormArray;
    }

    get stations(): IStation[] {
        return this.stationForm.controls[StationCreateFormFields.STATIONS]?.value;
    }

    public get fields() {
        return StationCreateFormFields;
    }

    onCancelEdit(): void {
        this.cancel.emit();
    }
}
