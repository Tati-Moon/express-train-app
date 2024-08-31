import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { TagModule } from 'primeng/tag';

import { Carriage } from '../../../core/models';
import { Route } from '../../../core/models/route/route.model';
import { Station } from '../../../core/models/station/station.model';
import { AppRoutesActions } from '../../../redux/actions/app-routes.actions';
import { selectCarriages } from '../../../redux/selectors/app-carriages.selector';
import { selectStations } from '../../../redux/selectors/app-stations.selector';
import { RouteCreateFormFields, RouteFormMode } from '../../models/route-create-form.model';
import { ICarriage, IStation } from '../../models/station.interface';
import { RoutesService } from '../../services/route.service';

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
        MessagesModule,
    ],
    templateUrl: './route-edit-form.component.html',
    styleUrls: ['./route-edit-form.component.scss'],
})
export class EditRouteComponent implements OnInit {
    private store = inject(Store);

    public stations!: Signal<Station[]>;
    public allStations!: Signal<Station[]>;
    public allCarriages!: Signal<Carriage[]>;
    public id: number | null = null;

    @Input() public selectedRoute: Route | null = null;
    @Input() public mode: RouteFormMode = null;

    @Output() save = new EventEmitter<Route>();
    @Output() cancel = new EventEmitter<void>();

    constructor(
        private routeService: RoutesService,
        private fb: FormBuilder
    ) {
        const allStations$ = this.store.select(selectStations);
        this.allStations = toSignal(allStations$, { initialValue: [] });

        const allCarriages$ = this.store.select(selectCarriages);
        this.allCarriages = toSignal(allCarriages$, { initialValue: [] });
    }

    public get routeForm() {
        return this.routeService.routeCreateForm;
    }

    ngOnInit() {
        this.routeForm.reset();
        this.routeForm.patchValue({
            id: this.selectedRoute?.id ?? 0,
        });

        this.createStationsFormArray();
        this.createCarriagesListFormArray();

        this.id = this.routeForm.get([this.fields.ID])?.value ?? 0;
        if (this.id !== null && this.id > 0) {
            this.createPathFormArray(this.selectedRoute);
            this.createCarriageFormArray(this.selectedRoute);
        } else {
            this.createPathFormArray(null);
            this.createCarriageFormArray(null);
        }
    }

    createPathFormArray(selectedRoute: Route | null = null) {
        this.path.clear();
        selectedRoute?.path?.forEach((item) => {
            this.path.push(
                this.fb.group({
                    id: item,
                    city: this.allStations().find((station) => station.id === item)?.city,
                })
            );
        });
    }

    createCarriageFormArray(selectedRoute: Route | null = null) {
        const carriageToArray = this.routeForm.get(RouteCreateFormFields.CARRIAGES) as FormArray;
        carriageToArray.clear();
        selectedRoute?.carriages?.forEach((item) => {
            carriageToArray.push(
                this.fb.group({
                    name: item,
                    code: item,
                })
            );
        });
    }

    getStations(index: number) {
        if (index === 0) {
            return this.allStations();
        }
        const selectedCity = this.path?.value[index - 1]?.city;
        if (selectedCity) {
            const connectedTo = this.allStations().find((station) => station.city === selectedCity)?.connectedTo;
            return connectedTo;
        }
        return [];
    }

    getCarriages() {
        return this.allCarriages();
    }

    createStationsFormArray(): void {
        const stations = this.routeForm.get(RouteCreateFormFields.STATIONS_LIST);
        const stationsArray: IStation[] = this.allStations().map((item) => {
            return { id: item.id, city: item.city, latitude: item.latitude, longitude: item.longitude };
        });
        stations?.setValue(stationsArray);
    }

    createCarriagesListFormArray(): void {
        const carriageList = this.routeForm.get(RouteCreateFormFields.CARRIAGES_LIST);
        const carriagesArray: ICarriage[] = this.allCarriages().map((item) => {
            return { code: item.code, name: item.name };
        });
        carriageList?.setValue(carriagesArray);
    }

    public get fields() {
        return RouteCreateFormFields;
    }

    get path(): FormArray {
        return this.routeForm.controls[RouteCreateFormFields.PATH] as FormArray;
    }

    get carriages(): FormArray {
        return this.routeForm.controls[RouteCreateFormFields.CARRIAGES] as FormArray;
    }

    get carriagesList(): FormArray {
        return this.routeForm.controls[RouteCreateFormFields.CARRIAGES] as FormArray;
    }

    onSaveRoute(): void {
        if (this.routeForm.valid) {
            const paths = this.routeForm.get([this.fields.PATH])?.value;
            const carriagesList = this.routeForm.get([this.fields.CARRIAGES])?.value;

            const path = paths.map((item: IStation) => {
                const matchingStation = this.allStations().find((station) => station.city === item.city);
                return matchingStation ? matchingStation.id : null;
            });
            const cities = paths.map((item: IStation) => {
                const matchingStation = this.allStations().find((station) => station.city === item.city);
                return matchingStation ? matchingStation.city : null;
            });
            const carriages: string[] = carriagesList.map((carriage: { code: string; name: string }) => carriage.name);
            const route = { id: this.id ?? 0, path, carriages, stations: [], cities };

            if (route?.id != null && route?.id > 0) {
                this.store.dispatch(AppRoutesActions.initUpdateRoute({ id: route.id, route }));
            } else {
                this.store.dispatch(AppRoutesActions.initSaveNewRoute({ route }));
            }

            this.save.emit();
        }
    }

    onCancelEdit(): void {
        this.routeForm.reset();
        this.cancel.emit();
    }

    addCarriage(): void {
        this.carriages.push(
            this.fb.group({
                name: '',
            })
        );
    }

    removeCarriage(index: number): void {
        this.carriages.removeAt(index);
    }

    addStation(): void {
        this.path.push(
            this.fb.group({
                city: '',
            })
        );
    }

    removeStation(index: number): void {
        this.path.removeAt(index);
    }
}
