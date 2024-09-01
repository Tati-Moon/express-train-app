import { Component, inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

import { Routers } from '../../../core/models/enums/routers';
import { Route } from '../../../core/models/route/route.model';
import { AppRoutesActions } from '../../../redux/actions/app-routes.actions';
import {
    selectCurrentPage,
    selectPageSize,
    selectPaginatedRoutes,
    selectTotalRecords,
} from '../../../redux/selectors/app-routes.selector';
import { DeleteConfirmationComponent } from '../../components/delete-confirmation/delete-confirmation.component';
import { PageInfoListComponent } from '../../components/page-info-list/page-info-list.component';
import { EditRouteComponent } from '../../components/route-edit-form/route-edit-form.component';

@Component({
    selector: 'app-routes',
    standalone: true,
    imports: [
        ButtonModule,
        TranslateModule,
        EditRouteComponent,
        PaginatorModule,
        PageInfoListComponent,
        DeleteConfirmationComponent,
    ],
    templateUrl: './routes.component.html',
    styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent implements OnInit {
    private store = inject(Store);
    public isCreateRoute = false;
    public isEditRoute = false;

    public routes!: Signal<Route[]>;
    public selectedRoute: Route | null = null;

    public totalItems: Signal<number>;
    public currentPage: Signal<number>;
    public pageSize: Signal<number>;

    public deleteModalVisible: boolean = false;
    public routeToDelete!: number;

    constructor(private router: Router) {
        const routes$ = this.store.select(selectPaginatedRoutes);
        this.routes = toSignal(routes$, { initialValue: [] });

        this.totalItems = toSignal(this.store.select(selectTotalRecords), { initialValue: 0 });
        this.currentPage = toSignal(this.store.select(selectCurrentPage), { initialValue: 0 });
        this.pageSize = toSignal(this.store.select(selectPageSize), { initialValue: 10 });
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
        this.selectedRoute = null;
    }

    onSelectRoute(route: Route): void {
        this.isCreateRoute = false;
        this.isEditRoute = true;
        this.selectedRoute = { ...route };
    }

    onSaveRoute(): void {
        this.onCancelEdit();
        this.isEditRoute = false;
        this.isCreateRoute = false;
    }

    onCancelEdit(): void {
        this.selectedRoute = null;
        this.isEditRoute = false;
        this.isCreateRoute = false;
    }

    onAssignRide(id: number): void {
        this.router.navigate([`${Routers.ADMIN}/${Routers.ROUTE}/${id}`]);
    }

    onDeleteRoute(id: number): void {
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
