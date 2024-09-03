import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SearchFormComponent } from '../../components/search-form/search-form.component';
// import { SearchResult } from '../../../core/models/search/search-result.model';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, ReactiveFormsModule, SearchFormComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent {
    // public searchResult!: SearchResult;
    // public receiveSearchResults(searchResults: SearchResult) {
    //   this.searchResult = searchResults;
    // }
}
