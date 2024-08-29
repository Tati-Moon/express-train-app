import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

import { Routers } from '../../../core/models/enums/routers';
import { AppTripActions } from '../../../redux/actions/app-trip.actions';
import { selectSelectedSeat, selectTripInfo, selectTripSchedule } from '../../../redux/selectors/app-trip.selector';
import { TripInfoComponent, TripRoutePopupComponent, TripSeatChoiceComponent } from '../../components';
import { SeatBooking, TripInfo } from '../../models';
import { CarriagesInTrain } from '../../models/trip-carriage.model';
import { TripSchedule } from '../../models/trip-schedule.model';

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
        RouterLink,
        TranslateModule,
    ],
    templateUrl: './trip.component.html',
    styleUrl: './trip.component.scss',
})
export class TripComponent implements OnInit {
    private store = inject(Store);

    public get routers() {
        return Routers;
    }

    public tripInfo!: Signal<TripInfo | null>;
    public tripSchedule!: Signal<TripSchedule | null>;
    public tripCarriagesInfo!: Signal<CarriagesInTrain | null>;
    public selectedSeat!: Signal<SeatBooking | null>;

    public showRouteModal: boolean = false;

    public rideIdParams!: number;
    public fromParams!: number;
    public toParams!: number;

    public occupiedSeatsStartAdded: boolean = false;
    public occupiedSeatsEndAdded: boolean = false;

    constructor(private route: ActivatedRoute) {
        const tripInfo$ = this.store.select(selectTripInfo);
        this.tripInfo = toSignal(tripInfo$, { initialValue: null });

        const tripSchedule$ = this.store.select(selectTripSchedule);
        this.tripSchedule = toSignal(tripSchedule$, { initialValue: null });

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

    public handleOrdering(): void {
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
    public handleClearSelectedSeat(): void {
        this.store.dispatch(AppTripActions.clearSelectedSeat());
    }
}
