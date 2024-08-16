import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

import { AppConfigActions } from '../../../redux/actions/app-config.actions';
import { AppLanguageActions } from '../../../redux/actions/app-language.actions';
import { selectUserMenuInit, selectUserMenuShow } from '../../../redux/selectors/app-config.selector';
import { selectLanguageMenuInit, selectLanguageMenuShow } from '../../../redux/selectors/app-language.selector';
import { selectColorScheme } from '../../../redux/selectors/app-theme.selector';
import { Schemes } from '../../models/enums/constants';
import { LayoutService } from '../../services/layout.service';
import { HeaderMenuComponent } from './ui/header-menu/header-menu.component';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule, MenuModule, HeaderMenuComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    private store = inject(Store);

    public userMenu!: Signal<MenuItem[]>;
    public userMenuShow!: Signal<boolean>;

    public languageMenu!: Signal<MenuItem[]>;
    public languageMenuShow!: Signal<boolean>;

    public colorScheme!: Signal<string>;

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private readonly translateService: TranslateService
    ) {
        const userMenu$ = this.store.select(selectUserMenuInit);
        this.userMenu = toSignal(userMenu$, { initialValue: [] });

        const userMenuShow$ = this.store.select(selectUserMenuShow);
        this.userMenuShow = toSignal(userMenuShow$, { initialValue: false });

        const languageMenu$ = this.store.select(selectLanguageMenuInit);
        this.languageMenu = toSignal(languageMenu$, { initialValue: [] });

        const languageMenuShow$ = this.store.select(selectLanguageMenuShow);
        this.languageMenuShow = toSignal(languageMenuShow$, { initialValue: false });

        const colorScheme$ = this.store.select(selectColorScheme);
        this.colorScheme = toSignal(colorScheme$, { initialValue: Schemes.LIGHT });
    }

    public handleOpenUserMenu(): void {
        if (!this.userMenuShow()) {
            this.store.dispatch(AppConfigActions.openUserProfileMenu());
        }
    }

    public handleCloseUserMenu(): void {
        if (this.userMenuShow()) {
            this.store.dispatch(AppConfigActions.closeUserProfileMenu());
        }
    }

    public handleOpenLanguageMenu(): void {
        if (!this.languageMenuShow()) {
            this.store.dispatch(AppLanguageActions.openLanguageMenu());
        }
    }

    public handleCloseLanguageMenu(): void {
        if (this.languageMenuShow()) {
            this.store.dispatch(AppLanguageActions.closeLanguageMenu());
        }
    }

    public handleSelectLanguage(item: MenuItem): void {
        if (item.id) {
            this.store.dispatch(AppLanguageActions.updateApplicationLanguage({ language: item.id }));
        }
    }
}
