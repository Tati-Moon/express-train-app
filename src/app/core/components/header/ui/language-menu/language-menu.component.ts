import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';

import { CloseAllOverlayDirective } from '../../../../directives/close-all-overlay.directive';
import { Languages, Schemes } from '../../../../models/enums/constants';

@Component({
    selector: 'app-language-menu',
    standalone: true,
    imports: [TranslateModule, CommonModule, RouterLink, CloseAllOverlayDirective, RouterModule],
    templateUrl: './language-menu.component.html',
    styleUrls: ['../header-menu/header-menu.component.scss', './language-menu.component.scss'],
})
export class LanguageMenuComponent {
    @Input() text: string = '';
    @Input() show: boolean = false;
    @Input() modelMenu: MenuItem[] = [];
    @Output() openMenu = new EventEmitter<boolean>();
    @Output() closeMenu = new EventEmitter<boolean>();
    @Output() selectedItem = new EventEmitter<MenuItem>();

    @Input() lang: string = Languages.EN;
    @Input() colorScheme: string = Schemes.LIGHT;

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
