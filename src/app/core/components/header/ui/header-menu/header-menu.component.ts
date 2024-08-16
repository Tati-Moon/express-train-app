import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';

import { CloseAllOverlayDirective } from '../../../../directives/close-all-overlay.directive';

@Component({
    selector: 'app-header-menu',
    standalone: true,
    imports: [TranslateModule, CommonModule, RouterLink, CloseAllOverlayDirective, RouterModule],
    templateUrl: './header-menu.component.html',
    styleUrl: './header-menu.component.scss',
})
export class HeaderMenuComponent {
    @Input() icon: string = 'pi pi-ellipsis-v';
    @Input() text: string = '';
    @Input() show: boolean = false;
    @Input() modelMenu: MenuItem[] = [];
    @Output() openMenu = new EventEmitter<boolean>();
    @Output() closeMenu = new EventEmitter<boolean>();
    @Output() selectedItem = new EventEmitter<MenuItem>();

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
