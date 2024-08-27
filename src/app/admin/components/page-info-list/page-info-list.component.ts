import { Component, Input } from '@angular/core';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-page-info-list',
    standalone: true,
    imports: [TagModule],
    templateUrl: './page-info-list.component.html',
    styleUrl: './page-info-list.component.scss',
})
export class PageInfoListComponent {
    @Input() title!: string;
    @Input() items!: string[];
}
