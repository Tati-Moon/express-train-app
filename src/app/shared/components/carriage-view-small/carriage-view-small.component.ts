import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';

import { Carriage } from '../../../core/models';
import { SeatBooking } from '../../../home/models';
import { selectBusySeats, selectSelectedSeat } from '../../../redux/selectors/app-trip.selector';
import { CarriageSeatComponent } from '../carriage-seat/carriage-seat.component';
import { CarriageViewSkeletonComponent } from '../carriage-view-skeleton/carriage-view-skeleton.component';

@Component({
    selector: 'app-carriage-view-small',
    standalone: true,
    imports: [SkeletonModule, CarriageSeatComponent, CarriageViewSkeletonComponent, CommonModule, ButtonModule],
    templateUrl: './carriage-view-small.component.html',
    styleUrl: './carriage-view-small.component.scss',
})
export class CarriageViewSmallComponent {
    private store = inject(Store);

    @Input() public carriage!: Carriage | null;

    public selectedSeat!: Signal<SeatBooking | null>;
    public busySeats!: Signal<number[]>;

    constructor(private cdr: ChangeDetectorRef) {
        const selectedSeat$ = this.store.select(selectSelectedSeat);
        this.selectedSeat = toSignal(selectedSeat$, { initialValue: null });

        const busySeats$ = this.store.select(selectBusySeats);
        this.busySeats = toSignal(busySeats$, { initialValue: [] });
    }

    public show: boolean = true;

    public imageSrc!: string;

    public getRowsArray(rows: number): number[] {
        return Array(rows)
            .fill(0)
            .map((_, index) => index);
    }

    public getSeatsArray(seats: number): number[] {
        return Array(seats)
            .fill(0)
            .map((_, index) => index);
    }

    public getSeatNumber(rowIndex: number, seatIndex: number, side: 'left' | 'right'): number {
        if (this.carriage) {
            const { leftSeats } = this.carriage;
            const { rightSeats } = this.carriage;

            if (side === 'left') {
                return rowIndex * (leftSeats + rightSeats) + seatIndex + 1;
            }
            return rowIndex * (leftSeats + rightSeats) + leftSeats + seatIndex + 1;
        }
        return 0;
    }
}
