import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';

import { Station } from '../../../core/models/station/station.model';
import { AppOrdersActions } from '../../../redux/actions/app-orders.actions';
import { AppStationsActions } from '../../../redux/actions/app-station.actions';
import {
    selectCurrentPage,
    selectPageSize,
    selectPaginatedStations,
    selectTotalRecords,
} from '../../../redux/selectors/app-stations.selector';
import { DeleteConfirmationComponent } from '../../components/delete-confirmation/delete-confirmation.component';
import { PageInfoListComponent } from '../../components/page-info-list/page-info-list.component';
import { CreateStationComponent } from '../../components/station-create-form/station-create-form.component';
import { ViewStationComponent } from '../../components/station-view-form/station-view-form.component';

@Component({
    selector: 'app-stations',
    standalone: true,
    imports: [
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
    public isCreateStation = false;
    public isEditStation = false;
    public stations!: Signal<Station[]>;
    public selectedStation: Station | null = null;
    public totalItems: Signal<number>;
    public currentPage: Signal<number>;
    public pageSize: Signal<number>;
    public deleteModalVisible: boolean = false;
    public stationToDelete!: number;

    constructor() {
        const stations$ = this.store.select(selectPaginatedStations);
        this.stations = toSignal(stations$, { initialValue: [] });
        this.totalItems = toSignal(this.store.select(selectTotalRecords), { initialValue: 0 });
        this.currentPage = toSignal(this.store.select(selectCurrentPage), { initialValue: 0 });
        this.pageSize = toSignal(this.store.select(selectPageSize), { initialValue: 10 });
    }

    ngOnInit(): void {
        this.getAllItems();
    }

    getAllItems(): void {
        this.store.dispatch(AppOrdersActions.loadOrders({ all: true }));
    }

    onPageChange(event: PaginatorState): void {
        this.store.dispatch(
            AppStationsActions.changePagination({ currentPage: event.page ?? 0, pageSize: event.rows ?? 10 })
        );
    }

    onAddNewStation(): void {
        this.isCreateStation = true;
        this.isEditStation = false;
    }

    onSelectStation(station: Station): void {
        this.isCreateStation = false;
        this.isEditStation = true;
        this.selectedStation = { ...station };
    }

    onSaveStation(): void {
        this.onCancelEdit();
        this.isEditStation = false;
        this.isCreateStation = false;
    }

    onCancelEdit(): void {
        this.selectedStation = null;
        this.isEditStation = false;
        this.isCreateStation = false;
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
