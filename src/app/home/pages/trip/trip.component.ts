import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { tap } from 'rxjs';

import { Routers } from '../../../core/models/enums/routers';
import { UserRole } from '../../../core/models/user/user.model';
import { AppTripActions } from '../../../redux/actions/app-trip.actions';
import { selectSelectedSeat, selectTripInfo, selectTripSchedule } from '../../../redux/selectors/app-trip.selector';
import { selectUserRole } from '../../../redux/selectors/app-user.selector';
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
        AccordionModule,
        BadgeModule,
    ],
    templateUrl: './trip.component.html',
    styleUrl: './trip.component.scss',
})
export class TripComponent implements OnInit {
    private store = inject(Store);

    public get routers() {
        return Routers;
    }

    public tripInfo!: Signal<TripInfo | Error | null>;
    public tripSchedule!: Signal<TripSchedule | null>;
    public tripCarriagesInfo!: Signal<CarriagesInTrain | null>;
    public selectedSeat!: Signal<SeatBooking | null>;
    public userRole!: Signal<UserRole | null>;

    public showRouteModal: boolean = false;

    public rideIdParams!: number;
    public fromParams!: number;
    public toParams!: number;

    public occupiedSeatsStartAdded: boolean = false;
    public occupiedSeatsEndAdded: boolean = false;

    public get headerAccordion(): string {
        return this.translate.instant('TRIP.INFO_ABOUT_TRIP');
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private translate: TranslateService
    ) {
        const tripInfo$ = this.store.select(selectTripInfo).pipe(
            tap((response) => {
                if (response instanceof Error) {
                    router.navigate([Routers.ERROR]);
                }
            })
        );
        this.tripInfo = toSignal(tripInfo$, { initialValue: null });

        const tripSchedule$ = this.store.select(selectTripSchedule);
        this.tripSchedule = toSignal(tripSchedule$, { initialValue: null });

        const selectedSeat$ = this.store.select(selectSelectedSeat);
        this.selectedSeat = toSignal(selectedSeat$, { initialValue: null });

        const userRole$ = this.store.select(selectUserRole);
        this.userRole = toSignal(userRole$, { initialValue: null });
    }

    public ngOnInit(): void {
        this.rideIdParams = +this.route.snapshot.params['rideId'];
        this.fromParams = +this.route.snapshot.queryParams['from'];
        this.toParams = +this.route.snapshot.queryParams['to'];

        if (!this.rideIdParams || !this.fromParams || !this.toParams) {
            this.router.navigate([Routers.ROOT]);
        }

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
        if (seat && this.userRole()) {
            this.store.dispatch(
                AppTripActions.orderingSeat({
                    rideId: this.rideIdParams,
                    from: this.fromParams,
                    to: this.toParams,
                    seat,
                })
            );
        } else {
            this.router.navigate([Routers.SIGNIN]);
        }
    }

    public handleClearSelectedSeat(): void {
        this.store.dispatch(AppTripActions.clearSelectedSeat());
    }
}
