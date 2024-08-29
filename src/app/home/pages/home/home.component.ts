import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';

import { SearchFormComponent } from '../../components/search-form/search-form.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, FormsModule, DropdownModule, TranslateModule, ReactiveFormsModule, SearchFormComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent {}
