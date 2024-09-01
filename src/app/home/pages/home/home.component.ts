import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';

import { ResultListComponent } from '../../components/result-list/result-list.component';
import { SearchFormComponent } from '../../components/search-form/search-form.component';
// import { SearchResult } from '../../../core/models/search/search-result.model';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DropdownModule,
        TranslateModule,
        ReactiveFormsModule,
        SearchFormComponent,
        ResultListComponent,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent {
    // public searchResult!: SearchResult;
    // public receiveSearchResults(searchResults: SearchResult) {
    //   this.searchResult = searchResults;
    // }
}
