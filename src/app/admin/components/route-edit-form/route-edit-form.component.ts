import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

import { Route } from '../../../core/models/route/route.model';
import { RouteCreateFormFields, RouteFormMode } from '../../models/route-create-form.model';
import { ICarriage, IStation } from '../../models/station.interface';

@Component({
    selector: 'app-edit-route',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        InputTextModule,
        ButtonModule,
        TranslateModule,
        DropdownModule,
        TagModule,
    ],
    templateUrl: './route-edit-form.component.html',
    styleUrls: ['./route-edit-form.component.scss'],
})
export class EditRouteComponent {
    @Input() public mode: RouteFormMode = null;
    @Input() routeForm!: FormGroup;
    @Output() save = new EventEmitter<Route>();
    @Output() cancel = new EventEmitter<void>();

    constructor(private fb: FormBuilder) {}

    public get fields() {
        return RouteCreateFormFields;
    }

    get stations(): IStation[] {
        return this.routeForm.controls[RouteCreateFormFields.STATIONS_LIST]?.value;
    }

    get path(): FormArray {
        return this.routeForm.controls[RouteCreateFormFields.PATH] as FormArray;
    }

    get carriages(): FormArray {
        return this.routeForm.controls[RouteCreateFormFields.CARRIAGES] as FormArray;
    }

    get carriageList(): ICarriage[] {
        return this.routeForm.controls[RouteCreateFormFields.CARRIAGES_LIST]?.value;
    }

    get carriagesList(): FormArray {
        return this.routeForm.controls[RouteCreateFormFields.CARRIAGES] as FormArray;
    }

    onSaveRoute(): void {
        if (this.routeForm.valid) {
            const id = this.routeForm.get([this.fields.ID])?.value;
            const paths = this.routeForm.get([this.fields.PATH])?.value;
            const carriagesList = this.routeForm.get([this.fields.CARRIAGES])?.value;

            const path = paths.map((item: IStation) => {
                const matchingStation = this.stations.find((station) => station.city === item.city);
                return matchingStation ? matchingStation.id : null;
            });

            const carriages: string[] = carriagesList.map((carriage: { code: string; name: string }) => carriage.name);

            this.save.emit({ id, path, carriages, stations: [], cities: [] });
        }
    }

    onCancelEdit(): void {
        this.cancel.emit();
    }

    addCarriage(): void {
        this.carriages.push(
            this.fb.group({
                name: [''],
                code: [''],
            })
        );
    }

    removeCarriage(index: number): void {
        this.carriages.removeAt(index);
    }

    addStation(): void {
        this.path.push(
            this.fb.group({
                city: [''],
                id: [0],
            })
        );
    }

    removeStation(index: number): void {
        this.path.removeAt(index);
    }
}
