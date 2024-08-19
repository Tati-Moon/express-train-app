import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { Carriage } from '../../../core/models';

@Component({
    selector: 'app-carriage-table',
    standalone: true,
    imports: [TableModule, ButtonModule, TranslateModule],
    templateUrl: './carriage-table.component.html',
    styleUrl: './carriage-table.component.scss',
})
export class CarriageTableComponent {
    @Input() carriages: Carriage[] = [];
}
