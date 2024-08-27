import { Component, inject, Input, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';

import { Carriage } from '../../../core/models';
import { selectBusySeats } from '../../../redux/selectors/app-trip.selector';
import { CarriageViewComponent } from '../../../shared/components';
import { CarriagesInTrain } from '../../models/trip-carriage.model';

@Component({
    selector: 'app-trip-seat-choice',
    standalone: true,
    imports: [TabViewModule, BadgeModule, AvatarModule, CarriageViewComponent, TranslateModule, ButtonModule],
    templateUrl: './trip-seat-choice.component.html',
    styleUrl: './trip-seat-choice.component.scss',
})
export class TripSeatChoiceComponent {
    @Input() public tripCarriages: CarriagesInTrain | null = null;
    @Input() public seatsInTrain: number[] | null = null;

    private store = inject(Store);
    public busySeats!: Signal<number[]>;

    constructor() {
        const busySeats$ = this.store.select(selectBusySeats);
        this.busySeats = toSignal(busySeats$, { initialValue: [] });
    }

    public get carriages(): string[] {
        if (this.tripCarriages) {
            return Object.keys(this.tripCarriages);
        }
        return [];
    }

    public getCarriagesCount(count: number): number[] {
        return new Array(count);
    }

    public getCarriage(code: string): Carriage {
        if (!this.tripCarriages) return { code, name: code, leftSeats: 0, rightSeats: 0, rows: 0 };

        const carriage = this.tripCarriages[code];
        return {
            code,
            name: code,
            leftSeats: carriage.leftSeats,
            rightSeats: carriage.rightSeats,
            rows: carriage.rows,
        };
    }

    public getCountSeats(code: string): number {
        if (!this.tripCarriages) return 0;

        const carriage = this.tripCarriages[code];
        return (carriage.leftSeats + carriage.rightSeats) * carriage.rows;
    }

    public startIndexSeats(index: number, code: string): number {
        if (!this.tripCarriages) return 0;
        if (!this.seatsInTrain) return 0;

        const carriage = this.tripCarriages[code];
        const indexCarriage = carriage.indexCar[index];
        if (indexCarriage === 0) return 0;

        const result = this.seatsInTrain.slice(0, indexCarriage).reduce((acc: number, curr: number) => acc + curr, 0);
        return result;
    }
}
