import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';

import { AppDatePipe } from '../../../core/pipes/date.pipe';
import { TripInfo } from '../../models';

@Component({
    selector: 'app-trip-info',
    standalone: true,
    imports: [ButtonModule, CommonModule, TranslateModule, TimelineModule, AppDatePipe],
    templateUrl: './trip-info.component.html',
    styleUrl: './trip-info.component.scss',
})
export class TripInfoComponent {
    @Input() public tripInfo: TripInfo | Error | null = null;
    @Output() public openModal = new EventEmitter();

    public handleOpenModal(): void {
        this.openModal.emit();
    }

    public get stations() {
        if (this.tripInfo && !(this.tripInfo instanceof Error) && this.tripInfo.from && this.tripInfo.to) {
            return [this.tripInfo.from, '>', this.tripInfo.to];
        }
        return null;
    }

    public get departureTime(): string {
        if (this.tripInfo && !(this.tripInfo instanceof Error)) {
            return this.tripInfo.departureTime;
        }
        return '';
    }

    public get arrivalTime(): string {
        if (this.tripInfo && !(this.tripInfo instanceof Error)) {
            return this.tripInfo.arrivalTime;
        }
        return '';
    }

    public get rideId(): number {
        if (this.tripInfo && !(this.tripInfo instanceof Error)) {
            return this.tripInfo.rideId;
        }
        return -1;
    }

    public get tripInfoCheck(): boolean {
        if (!(this.tripInfo instanceof Error)) {
            return true;
        }
        return false;
    }
}
