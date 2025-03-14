import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { Carriage } from '../../../core/models';
import { CarriageViewSmallComponent } from '../../../shared/components';

@Component({
    selector: 'app-carriage-table',
    standalone: true,
    imports: [TableModule, ButtonModule, TranslateModule, CarriageViewSmallComponent],
    templateUrl: './carriage-table.component.html',
    styleUrl: './carriage-table.component.scss',
})
export class CarriageTableComponent {
    @Input() public carriages: Carriage[] = [];
    @Output() public editCarriage = new EventEmitter<Carriage>();

    public handleEditCarriage(carriage: Carriage): void {
        this.editCarriage.emit(carriage);
    }
}
