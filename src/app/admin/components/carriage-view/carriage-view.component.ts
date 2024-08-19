import { Component, Input } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

import { Carriage } from '../../../core/models';
import { CarriageSeatComponent } from '../carriage-seat/carriage-seat.component';
import { CarriageViewSkeletonComponent } from '../carriage-view-skeleton/carriage-view-skeleton.component';

@Component({
    selector: 'app-carriage-view',
    standalone: true,
    imports: [SkeletonModule, CarriageSeatComponent, CarriageViewSkeletonComponent],
    templateUrl: './carriage-view.component.html',
    styleUrl: './carriage-view.component.scss',
})
export class CarriageViewComponent {
    @Input() public carriage!: Carriage | null;

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

    public getSeatNumber(rowIndex: number, seatIndex: number, side: 'left' | 'right'): number | string {
        if (this.carriage) {
            const { leftSeats } = this.carriage;
            const { rightSeats } = this.carriage;

            if (side === 'left') {
                return rowIndex * (leftSeats + rightSeats) + seatIndex + 1;
            }
            return rowIndex * (leftSeats + rightSeats) + leftSeats + seatIndex + 1;
        }
        return '-';
    }
}
