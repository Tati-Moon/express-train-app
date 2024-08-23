import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import { SkeletonModule } from 'primeng/skeleton';

import { Carriage } from '../../../core/models';
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
    @Input() public carriage!: Carriage | null;
    @Input() public mode: 'picture' | null = null;
    public show: boolean = true;

    public imageSrc!: string;

    @ViewChild('card') content!: ElementRef;

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

    public ngAfterViewInit(): void {
        if (this.mode === 'picture')
            html2canvas(this.content.nativeElement).then((canvas) => {
                this.imageSrc = canvas.toDataURL('image/png');
                this.show = false;
            });
    }
}
