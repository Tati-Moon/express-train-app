import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { Component, inject, Input, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Observable, of } from 'rxjs';

import { Carriage } from '../../../core/models';
import { Schedule, ScheduleRide } from '../../../core/models/schedules/schedule.model';
import { Station } from '../../../core/models/station/station.model';
import { AppSchedulesActions } from '../../../redux/actions/app-schedule.actions';
import { selectStationById } from '../../../redux/selectors/app-stations.selector';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { RidePriceItemComponent } from '../ride-price-item/ride-price-item.component';
import { RideTimeItemComponent } from '../ride-time-item/ride-time-item.component';

registerLocaleData(localeRu, 'ru');

@Component({
    selector: 'app-ride-table',
    standalone: true,
    imports: [
        TableModule,
        ButtonModule,
        TranslateModule,
        CommonModule,
        DatePipe,
        TagModule,
        InputTextModule,
        FormsModule,
        ReactiveFormsModule,
        RidePriceItemComponent,
        RideTimeItemComponent,
        MessagesModule,
        DeleteConfirmationComponent,
    ],
    templateUrl: './ride-table.component.html',
    styleUrl: './ride-table.component.scss',
    providers: [{ provide: LOCALE_ID, useValue: 'ru-RU' }],
})
export class RideTableComponent {
    private store = inject(Store);
    public deleteModalVisible: boolean = false;
    public rideToDelete!: number;
    @Input() public carriages: Carriage[] = [];
    @Input() public rides!: ScheduleRide | null;
    @Input() public routeId!: number;
    public editTimeIndex: number | null = null;
    public editPriceIndex: number | null = null;
    public selectedRideId: number | null = null;

    stationsMap: Map<number, Observable<Station | null>> = new Map();

    getStation(id: number): Observable<Station | null> {
        if (!this.stationsMap.has(id)) {
            const stationSelector = selectStationById(id);
            const station$ = this.store.select(stationSelector);
            this.stationsMap.set(id, station$);
        }
        return this.stationsMap.get(id) || of(null);
    }

    getKeys(obj: { [key: string]: number }): string[] {
        return Object.keys(obj);
    }

    getValue(obj: { [key: string]: number }, key: string): number {
        return obj[key];
    }

    onEditTimes(index: number, schedule: Schedule) {
        this.editTimeIndex = index;
        this.editPriceIndex = null;
        this.selectedRideId = schedule.rideId;
    }

    onSaveTimes(updatedSchedule: Schedule) {
        this.editTimeIndex = null;
        this.store.dispatch(
            AppSchedulesActions.initUpdateSchedule({
                routeId: this.routeId,
                rideId: updatedSchedule.rideId,
                segments: updatedSchedule.segments,
            })
        );
    }

    onEditPrices(index: number, schedule: Schedule) {
        this.editTimeIndex = null;
        this.editPriceIndex = index;
        this.selectedRideId = schedule.rideId;
    }

    onCancelEdit() {
        this.editTimeIndex = null;
        this.editPriceIndex = null;
        this.selectedRideId = null;
    }

    onSavePrices(updatedSchedule: Schedule) {
        this.editPriceIndex = null;
        this.store.dispatch(
            AppSchedulesActions.initUpdateSchedule({
                routeId: this.routeId,
                rideId: updatedSchedule.rideId,
                segments: updatedSchedule.segments,
            })
        );
    }

    onDeleteRide(id: number) {
        this.rideToDelete = id;
        this.deleteModalVisible = true;
    }

    onConfirmDelete(id: number): void {
        this.store.dispatch(
            AppSchedulesActions.initDeleteSchedule({
                routeId: this.routeId,
                rideId: id,
            })
        );
        this.deleteModalVisible = false;
    }

    onCancelDelete(): void {
        this.deleteModalVisible = false;
        this.rideToDelete = null!;
    }

    isTheRouteOverdue(date: string): boolean {
        const inputDate = new Date(date);
        const currentDate = new Date();

        return inputDate < currentDate;
    }
}
