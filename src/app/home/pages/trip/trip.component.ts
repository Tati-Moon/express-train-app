import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

import { Carriage } from '../../../core/models';
import { Station } from '../../../core/models/station/station.model';
import { AppTripActions } from '../../../redux/actions/app-trip.actions';
import { selectCarriages } from '../../../redux/selectors/app-carriages.selector';
import { selectStations } from '../../../redux/selectors/app-stations.selector';
import {
    selectSelectedSeat,
    selectTrip,
    selectTripCarriages,
    selectTripInfo,
    selectTripSchedule,
} from '../../../redux/selectors/app-trip.selector';
import { TripInfoComponent, TripRoutePopupComponent, TripSeatChoiceComponent } from '../../components';
import { SeatBooking, Trip, TripInfo } from '../../models';
import { TripCarriagesInfo } from '../../models/trip-carriage.model';
import { TripSchedule } from '../../models/trip-schedule.model';
import { TripService } from '../../services/trip.service';

@Component({
    selector: 'app-trip',
    standalone: true,
    imports: [
        ToolbarModule,
        ButtonModule,
        TripInfoComponent,
        TripRoutePopupComponent,
        CommonModule,
        TripSeatChoiceComponent,
    ],
    templateUrl: './trip.component.html',
    styleUrl: './trip.component.scss',
})
export class TripComponent implements OnInit {
    private store = inject(Store);

    public trip!: Signal<Trip | null>;
    public carriages!: Signal<Carriage[]>;
    public stations!: Signal<Station[]>;
    public tripInfo!: Signal<TripInfo | null>;
    public tripSchedule!: Signal<TripSchedule | null>;
    public tripCarriagesInfo!: Signal<TripCarriagesInfo | null>;
    public selectedSeat!: Signal<SeatBooking | null>;

    public showRouteModal: boolean = false;

    public rideIdParams!: number;
    public fromParams!: number;
    public toParams!: number;

    public occupiedSeatsStartAdded: boolean = false;
    public occupiedSeatsEndAdded: boolean = false;

    constructor(
        private tripService: TripService,
        private route: ActivatedRoute
    ) {
        const trip$ = this.store.select(selectTrip);
        this.trip = toSignal(trip$, { initialValue: null });

        const carriages$ = this.store.select(selectCarriages);
        this.carriages = toSignal(carriages$, { initialValue: [] });

        const stations$ = this.store.select(selectStations);
        this.stations = toSignal(stations$, { initialValue: [] });

        const tripInfo$ = this.store.select(selectTripInfo);
        this.tripInfo = toSignal(tripInfo$, { initialValue: null });

        const tripSchedule$ = this.store.select(selectTripSchedule);
        this.tripSchedule = toSignal(tripSchedule$, { initialValue: null });

        const tripCarriagesInfo$ = this.store.select(selectTripCarriages);
        this.tripCarriagesInfo = toSignal(tripCarriagesInfo$, { initialValue: null });

        const selectedSeat$ = this.store.select(selectSelectedSeat);
        this.selectedSeat = toSignal(selectedSeat$, { initialValue: null });
    }

    public ngOnInit(): void {
        this.rideIdParams = +this.route.snapshot.params['rideId'];
        this.fromParams = +this.route.snapshot.queryParams['from'];
        this.toParams = +this.route.snapshot.queryParams['to'];

        if (this.rideIdParams) {
            this.store.dispatch(
                AppTripActions.loadTripInfo({ rideId: this.rideIdParams, from: this.fromParams, to: this.toParams })
            );
        }
    }

    public handleOpenModal(): void {
        this.showRouteModal = true;
    }

    public handleCloseModal(): void {
        this.showRouteModal = false;
    }

    public handleTestOrder(): void {
        const seat = this.selectedSeat()?.seatInTrain;
        if (seat) {
            this.store.dispatch(
                AppTripActions.orderingSeat({
                    rideId: this.rideIdParams,
                    from: this.fromParams,
                    to: this.toParams,
                    seat,
                })
            );
        }
    }
}
