import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';

import { TripInfo } from '../../models';

@Component({
    selector: 'app-trip-info',
    standalone: true,
    imports: [ButtonModule, CommonModule, TranslateModule, TimelineModule],
    templateUrl: './trip-info.component.html',
    styleUrl: './trip-info.component.scss',
})
export class TripInfoComponent {
    @Input() public tripInfo: TripInfo | null = null;
    @Output() public openModal = new EventEmitter();

    public handleOpenModal(): void {
        this.openModal.emit();
    }

    public get stations() {
        if (this.tripInfo?.from && this.tripInfo?.to) {
            return [this.tripInfo?.from, '>', this.tripInfo?.to];
        }
        return null;
    }
}
