import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { TripInfo } from '../../models';

@Component({
    selector: 'app-trip-info',
    standalone: true,
    imports: [ButtonModule, CommonModule],
    templateUrl: './trip-info.component.html',
    styleUrl: './trip-info.component.scss',
})
export class TripInfoComponent {
    @Input() public tripInfo: TripInfo | null = null;
    @Output() public openModal = new EventEmitter();

    handleOpenModal() {
        this.openModal.emit();
    }
}
