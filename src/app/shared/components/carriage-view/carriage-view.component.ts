import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    Input,
    Signal,
    ViewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import html2canvas from 'html2canvas';
import { SkeletonModule } from 'primeng/skeleton';

import { Carriage } from '../../../core/models';
import { SeatStatus } from '../../../core/models/enums/constants';
import { SeatBooking } from '../../../home/models';
import { AppTripActions } from '../../../redux/actions/app-trip.actions';
import { selectBusySeats, selectSelectedSeat } from '../../../redux/selectors/app-trip.selector';
import { CarriageSeatComponent } from '../carriage-seat/carriage-seat.component';
import { CarriageViewSkeletonComponent } from '../carriage-view-skeleton/carriage-view-skeleton.component';

@Component({
    selector: 'app-carriage-view',
    standalone: true,
    imports: [SkeletonModule, CarriageSeatComponent, CarriageViewSkeletonComponent, CommonModule],
    templateUrl: './carriage-view.component.html',
    styleUrl: './carriage-view.component.scss',
})
export class CarriageViewComponent implements AfterViewInit {
    private store = inject(Store);

    @Input() public numberOfCarriage!: number | null;
    @Input() public carriage!: Carriage | null;
    @Input() public mode: 'picture' | null = null;
    @Input() public startIndexSeats: number = 0;
    @Input() public price: number = 0;
    @ViewChild('card') content!: ElementRef;

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

    public ngAfterViewInit(): void {
        if (this.mode === 'picture')
            html2canvas(this.content.nativeElement).then((canvas) => {
                this.imageSrc = canvas.toDataURL('image/png');
                this.show = false;
            });
        this.cdr.markForCheck();
    }

    public handleSelectSeat(seatInCarriage: number): void {
        const seatInTrain = seatInCarriage + this.startIndexSeats;
        console.log(seatInTrain);
        if (this.numberOfCarriage) {
            this.store.dispatch(
                AppTripActions.selectSeat({
                    numberOfCarriage: this.numberOfCarriage,
                    seatInTrain,
                    seatInCarriage,
                    price: this.price,
                })
            );
        }
    }

    public handleIsBusySeat(index: number): string {
        const indexSeatInTrain = index + this.startIndexSeats;

        if (this.selectedSeat()?.seatInTrain === indexSeatInTrain) {
            return SeatStatus.SELECTED;
        }

        if (this.busySeats()?.includes(indexSeatInTrain)) {
            return SeatStatus.RESERVED;
        }

        return SeatStatus.AVAILABLE;
    }
}
