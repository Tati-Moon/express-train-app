import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

import { Carriage } from '../../../core/models';
import { Routers } from '../../../core/models/enums/routers';
import { ScheduleRide } from '../../../core/models/schedules/schedule.model';
import { Station } from '../../../core/models/station/station.model';
import { AppSchedulesActions } from '../../../redux/actions/app-schedule.actions';
import { selectCarriages } from '../../../redux/selectors/app-carriages.selector';
import { selectScheduleRide, selectShowSchedulesFormState } from '../../../redux/selectors/app-schedules.selector';
import { selectStations } from '../../../redux/selectors/app-stations.selector';
import { CarriageTableComponent } from '../../components/carriage-table/carriage-table.component';
import { RideCreateFormComponent } from '../../components/ride-create-form/ride-create-form.component';
import { RideTableComponent } from '../../components/ride-table/ride-table.component';

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
        RideCreateFormComponent,
        RouterLink,
    ],
    templateUrl: './route-info.component.html',
    styleUrl: './route-info.component.scss',
})
export class RouteInfoComponent implements OnInit, OnDestroy {
    private store = inject(Store);
    public showForm!: Signal<boolean>;

    public carriages!: Signal<Carriage[]>;
    public stations!: Signal<Station[] | null>;
    public rides!: Signal<ScheduleRide | null>;
    public routeIdParams!: number;
    public routesLink = `/${Routers.ADMIN}/${Routers.ROUTES}`;

    public get routers() {
        return Routers;
    }

    constructor(private route: ActivatedRoute) {
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
        this.routeIdParams = +this.route.snapshot.params['id'];
        if (this.routeIdParams) {
            this.store.dispatch(AppSchedulesActions.loadSchedules({ id: this.routeIdParams }));
        }
    }

    ngOnDestroy(): void {
        this.store.dispatch(AppSchedulesActions.hideFormSchedule());
    }

    public handleCreateRoute(): void {
        this.store.dispatch(AppSchedulesActions.initCreateSchedule());
    }
}
