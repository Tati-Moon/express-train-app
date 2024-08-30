import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

import { Carriage } from '../../../core/models';
import { Schemes } from '../../../core/models/enums/constants';
import { ScheduleRide } from '../../../core/models/schedules/schedule.model';
import { Station } from '../../../core/models/station/station.model';
import { AppSchedulesActions } from '../../../redux/actions/app-schedule.actions';
import { selectCarriages } from '../../../redux/selectors/app-carriages.selector';
import { selectScheduleRide, selectShowSchedulesFormState } from '../../../redux/selectors/app-schedules.selector';
import { selectStations } from '../../../redux/selectors/app-stations.selector';
import { selectColorScheme } from '../../../redux/selectors/app-theme.selector';
import { CarriageTableComponent } from '../../components/carriage-table/carriage-table.component';
import { RideTableComponent } from '../../components/ride-table/ride-table.component';
import { SchedulesService } from '../../services/schedules.service';

@Component({
    selector: 'app-route-info',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        InputTextModule,
        ButtonModule,
        TranslateModule,
        TagModule,
        CarriageTableComponent,
        RideTableComponent,
    ],
    templateUrl: './route-info.component.html',
    styleUrl: './route-info.component.scss',
})
export class RouteInfoComponent implements OnInit {
    private store = inject(Store);
    public colorScheme!: Signal<string>;
    public routeId = 2;
    public scheduleRide!: ScheduleRide;
    public showForm!: Signal<boolean>;

    public carriages!: Signal<Carriage[]>;
    public stations!: Signal<Station[] | null>;
    public rides!: Signal<ScheduleRide | null>;
    constructor(
        private scheduleService: SchedulesService,
        private fb: FormBuilder
    ) {
        const colorScheme$ = this.store.select(selectColorScheme);
        this.colorScheme = toSignal(colorScheme$, { initialValue: Schemes.LIGHT });

        const showForm$ = this.store.select(selectShowSchedulesFormState);
        this.showForm = toSignal(showForm$, { initialValue: false });

        const carriages$ = this.store.select(selectCarriages);
        this.carriages = toSignal(carriages$, { initialValue: [] });

        const scheduleRide$ = this.store.select(selectScheduleRide);
        this.rides = toSignal(scheduleRide$, { initialValue: null });

        const stations$ = this.store.select(selectStations);
        this.stations = toSignal(stations$, { initialValue: null });
    }

    ngOnInit(): void {
        // this.getAllItems();
        this.store.dispatch(AppSchedulesActions.loadSchedules({ id: this.routeId }));
    }

    getAllItems(): void {
        this.scheduleService.getRouteSchedule(this.routeId).subscribe((items) => {
            console.log('🚀 ~ RouteInfoComponent ~ this.scheduleService.getRouteSchedule ~ items:', items);
            this.scheduleRide = items;
        });
    }

    public handleCreateRoute(): void {
        console.log('🚀 ~ RouteInfoComponent ~ showForm:', this.showForm());
        this.store.dispatch(AppSchedulesActions.initCreateSchedule());
    }

    public handleEditRoute(carriage: Carriage): void {
        console.log('🚀 ~ RouteInfoComponent ~ handleEditCarriage ~ carriage:', carriage);
        console.log('🚀 ~ RouteInfoComponent ~ handleEditCarriage ~ handleEditCarriage:');
        // this.store.dispatch(AppCarriagesActions.initEditCarriage());
        // this.form.patchValue(carriage);
    }
}
