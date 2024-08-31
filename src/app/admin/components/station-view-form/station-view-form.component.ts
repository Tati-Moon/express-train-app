import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { Station } from '../../../core/models/station/station.model';
import { StationCreateFormFields, StationFormMode } from '../../models/station-create-form';
import { StationsService } from '../../services/stations.service';
import { MapViewComponent } from '../map-view/map-view.component';

@Component({
    selector: 'app-view-station',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, InputTextModule, ButtonModule, TranslateModule, MapViewComponent],
    templateUrl: './station-view-form.component.html',
    styleUrls: ['./station-view-form.component.scss'],
})
export class ViewStationComponent implements OnInit {
    @Input() public mode: StationFormMode = null;
    @Input() selectedStation: Station | null = null;
    @Output() cancel = new EventEmitter<void>();

    constructor(
        private stationsService: StationsService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.stationForm.patchValue({
            city: this.selectedStation?.city,
            latitude: this.selectedStation?.latitude,
            longitude: this.selectedStation?.longitude,
            id: this.selectedStation?.id,
        });

        this.createConnectedFormArray(this.selectedStation);

        this.stationForm.disable();
        this.stationForm.controls[StationCreateFormFields.CONNECTED_TO].disable();
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

    get city(): string {
        return this.stationForm.controls[StationCreateFormFields.CITY].value as string;
    }

    get longitude(): number {
        return this.stationForm.controls[StationCreateFormFields.LONGITUDE].value as number;
    }

    get latitude(): number {
        return this.stationForm.controls[StationCreateFormFields.LATITUDE].value as number;
    }

    public get stationForm() {
        return this.stationsService.stationCreateForm;
    }

    get connectedTo(): FormArray {
        return this.stationForm.controls[StationCreateFormFields.CONNECTED_TO] as FormArray;
    }

    public get fields() {
        return StationCreateFormFields;
    }

    onCancelEdit(): void {
        this.stationForm.reset();
        this.cancel.emit();
    }
}
