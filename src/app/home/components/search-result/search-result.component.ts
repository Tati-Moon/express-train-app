import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';

import { RideDetails } from '../../../core/models/search/search-result.model';
import { AppDatePipe } from '../../../core/pipes/date.pipe';
import { SearchResultItemComponent } from '../search-result-item/search-result-item.component';

@Component({
    selector: 'app-search-result',
    standalone: true,
    imports: [CommonModule, TranslateModule, ButtonModule, SearchResultItemComponent, TabViewModule, AppDatePipe],
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent {
    @Input() groupedResults: { [date: string]: RideDetails[] } = {};
    @Input() selectedTabIndex: number = 0;
    @Input() getSortedDates: () => string[] = () => [];
}
