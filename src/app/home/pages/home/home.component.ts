import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { RideDetails } from '../../../core/models/search/search-result.model';
import { SearchFormComponent } from '../../components/search-form/search-form.component';
import { SearchResultComponent } from '../../components/search-result/search-result.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        ReactiveFormsModule,
        SearchFormComponent,
        SearchResultComponent,
        ProgressSpinnerModule,
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
    @ViewChild(SearchFormComponent) searchFormComponent!: SearchFormComponent;

    groupedResults: { [date: string]: RideDetails[] } = {};
    selectedTabIndex: number = 0;
    startSearch!: boolean | null;

    ngAfterViewInit() {
        if (this.searchFormComponent) {
            this.searchFormComponent.searchCompleted.subscribe(() => {
                this.startSearch = this.searchFormComponent.startSearch;
                this.groupedResults = this.searchFormComponent.groupedResults;
                this.selectedTabIndex = this.searchFormComponent.selectedTabIndex;
            });
        }
    }

    onChildValueChanged(newValue: boolean) {
        this.startSearch = newValue;
    }

    getSortedDates(): string[] {
        return Object.keys(this.groupedResults).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    }
}
