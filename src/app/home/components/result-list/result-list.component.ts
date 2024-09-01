import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { TimelineModule } from 'primeng/timeline';

@Component({
    selector: 'app-search-result-list',
    standalone: true,
    imports: [TimelineModule, ButtonModule, ChipModule, DividerModule, TableModule, ButtonGroupModule, TranslateModule],
    templateUrl: './result-list.component.html',
    styleUrl: './result-list.component.scss',
})
export class ResultListComponent {
    public store = inject(Store);

    public events = [{ icon: 'pi pi-circle' }, { travelTime: '5h56m' }, { icon: 'pi pi-circle-fill' }];
    // @Input() public searchResult!: SearchResult;
}
