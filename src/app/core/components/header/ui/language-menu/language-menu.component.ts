import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { TagModule } from 'primeng/tag';

import { CloseAllOverlayDirective } from '../../../../directives/close-all-overlay.directive';

@Component({
    selector: 'app-language-menu',
    standalone: true,
    imports: [TranslateModule, CommonModule, RouterLink, CloseAllOverlayDirective, RouterModule, TagModule],
    templateUrl: './language-menu.component.html',
    styleUrl: './language-menu.component.scss',
})
export class LanguageMenuComponent {
    // @Input() icon: string = 'pi pi-ellipsis-v';
    @Input() text: string = '';
    @Input() show: boolean = false;
    @Input() modelMenu: MenuItem[] = [];
    @Output() openMenu = new EventEmitter<boolean>();
    @Output() closeMenu = new EventEmitter<boolean>();
    @Output() selectedItem = new EventEmitter<MenuItem>();

    @Input() flag: string = 'flag flag-en';

    public handleOpenMenu(): void {
        this.openMenu.emit(true);
    }

    public handleCloseMenu(): void {
        this.closeMenu.emit(true);
    }

    public handleSelectItem(item: MenuItem): void {
        this.selectedItem.emit(item);
    }
}
