import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TimelineModule } from 'primeng/timeline';

import { TripSchedule } from '../../models/trip-schedule.model';

@Component({
    selector: 'app-trip-route-popup',
    standalone: true,
    imports: [DialogModule, ButtonModule, TimelineModule, CommonModule],
    templateUrl: './trip-route-popup.component.html',
    styleUrl: './trip-route-popup.component.scss',
})
export class TripRoutePopupComponent {
    @Input() public tripSchedule: TripSchedule | null = null;
    @Input() showModal: boolean = true;
    @Output() closeModal = new EventEmitter();

    public handleCloseModal(): void {
        this.closeModal.emit();
    }
}
