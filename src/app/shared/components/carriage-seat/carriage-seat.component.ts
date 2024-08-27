import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { SeatStatus } from '../../../core/models/enums/constants';

@Component({
    selector: 'app-carriage-seat',
    standalone: true,
    imports: [ButtonModule],
    templateUrl: './carriage-seat.component.html',
    styleUrl: './carriage-seat.component.scss',
})
export class CarriageSeatComponent {
    @Input() public index: number = 0;
    @Input() public status: string = SeatStatus.AVAILABLE;
    @Output() public selectSeat = new EventEmitter<number>();

    public get seatStatus() {
        return SeatStatus;
    }

    public handleSelectSeat(index: number) {
        this.selectSeat.emit(index);
    }

    public handleSetColor(status: string) {
        switch (status) {
            case SeatStatus.AVAILABLE:
                return 'primary';
            case SeatStatus.RESERVED:
                return 'secondary';
            case SeatStatus.SELECTED:
                return 'warning';
            default:
                return 'primary';
        }
    }
}
