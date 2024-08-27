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

import { Carriage } from '../../../core/models';
import { Schemes } from '../../../core/models/enums/constants';
import { Route } from '../../../core/models/route/route.model';
import { Station } from '../../../core/models/station/station.model';
import { AppRoutesActions } from '../../../redux/actions/app-routes.actions';
import { selectCarriages } from '../../../redux/selectors/app-carriages.selector';
import {
    selectCurrentPage,
    selectPageSize,
    selectPaginatedRoutes,
    selectRoutes,
    selectTotalRecords,
} from '../../../redux/selectors/app-routes.selector';
import { selectStations } from '../../../redux/selectors/app-stations.selector';
import { selectColorScheme } from '../../../redux/selectors/app-theme.selector';
import { DeleteConfirmationComponent } from '../../components/delete-confirmation/delete-confirmation.component';
import { PageInfoListComponent } from '../../components/page-info-list/page-info-list.component';
import { EditRouteComponent } from '../../components/route-edit-form/route-edit-form.component';
import { RouteCreateFormFields } from '../../models/route-create-form.model';
import { ICarriage, IStation } from '../../models/station.interface';
import { RoutesService } from '../../services/route.service';

@Component({
    selector: 'app-routes',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        InputTextModule,
        ButtonModule,
        TranslateModule,
        EditRouteComponent,
        TagModule,
        PaginatorModule,
        PageInfoListComponent,
        DeleteConfirmationComponent,
    ],
    templateUrl: './routes.component.html',
    styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent implements OnInit {
    private store = inject(Store);
    public colorScheme!: Signal<string>;
    public isCreateRoute = false;
    public isEditRoute = false;

    public routes!: Signal<Route[]>;
    public allRoutes!: Signal<Route[]>;

    public allStations!: Signal<Station[]>;
    public allCarriages!: Signal<Carriage[]>;

    public selectedRoute: Route | null = null;

    public totalItems: Signal<number>;
    public currentPage: Signal<number>;
    public pageSize: Signal<number>;

    public deleteModalVisible: boolean = false;
    public routeToDelete!: number;

    constructor(
        private routeService: RoutesService,
        private fb: FormBuilder
    ) {
        const colorScheme$ = this.store.select(selectColorScheme);
        this.colorScheme = toSignal(colorScheme$, { initialValue: Schemes.LIGHT });

        const allRoutes$ = this.store.select(selectRoutes);
        this.allRoutes = toSignal(allRoutes$, { initialValue: [] });

        const allStations$ = this.store.select(selectStations);
        this.allStations = toSignal(allStations$, { initialValue: [] });

        const allCarriages$ = this.store.select(selectCarriages);
        this.allCarriages = toSignal(allCarriages$, { initialValue: [] });

        const routes$ = this.store.select(selectPaginatedRoutes);
        this.routes = toSignal(routes$, { initialValue: [] });

        this.totalItems = toSignal(this.store.select(selectTotalRecords), { initialValue: 0 });
        this.currentPage = toSignal(this.store.select(selectCurrentPage), { initialValue: 0 });
        this.pageSize = toSignal(this.store.select(selectPageSize), { initialValue: 10 });
    }

    public get routeForm() {
        return this.routeService.routeCreateForm;
    }

    ngOnInit(): void {
        this.getAllItems();
    }

    getAllItems(): void {
        this.store.dispatch(AppRoutesActions.loadRoutes());
    }

    onPageChange(event: PaginatorState): void {
        this.store.dispatch(
            AppRoutesActions.changePagination({ currentPage: event.page ?? 0, pageSize: event.rows ?? 10 })
        );
    }

    onAddNewRoute(): void {
        this.isCreateRoute = true;
        this.isEditRoute = false;

        this.routeForm.reset();
        this.routeForm.patchValue({
            id: 0,
        });

        this.createStationsFormArray();
        this.createCarriagesListFormArray();
        this.createPathFormArray(null);
        this.createCarriageFormArray(null);
    }

    createPathFormArray(selectedRoute: Route | null = null) {
        const pathToArray = this.routeForm.get(RouteCreateFormFields.PATH) as FormArray;
        pathToArray.clear();
        selectedRoute?.path?.forEach((item) => {
            pathToArray.push(
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

    onSelectRoute(route: Route): void {
        this.isCreateRoute = false;
        this.isEditRoute = true;
        this.selectedRoute = { ...route };

        this.routeForm.patchValue({
            id: this.selectedRoute.id,
        });

        this.createStationsFormArray();
        this.createCarriagesListFormArray();
        this.createPathFormArray(this.selectedRoute);
        this.createCarriageFormArray(this.selectedRoute);
    }

    onSaveRoute(route: Route): void {
        if (route?.id != null && route?.id > 0) {
            this.store.dispatch(AppRoutesActions.initUpdateRoute({ id: route.id, route }));
        } else {
            this.store.dispatch(AppRoutesActions.initSaveNewRoute({ route }));
        }

        this.onCancelEdit();
        this.isEditRoute = false;
        this.isCreateRoute = false;
    }

    onCancelEdit(): void {
        this.selectedRoute = null;
        this.isEditRoute = false;
        this.isCreateRoute = false;
        this.routeForm.reset();
    }

    onAssignRide(id: number): void {
        console.log('id', id);
    }

    onDeleteRoute(id: number): void {
        // this.store.dispatch(AppRoutesActions.initDeleteRoute({ id }));
        this.routeToDelete = id;
        this.deleteModalVisible = true;
    }

    onConfirmDelete(id: number): void {
        this.store.dispatch(AppRoutesActions.initDeleteRoute({ id }));
        this.deleteModalVisible = false;
    }

    onCancelDelete(): void {
        this.deleteModalVisible = false;
        this.routeToDelete = null!;
    }
}
