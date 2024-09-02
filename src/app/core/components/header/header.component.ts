import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';

import { AppAdminActions } from '../../../redux/actions/app-admin.actions';
import { AppLanguageActions } from '../../../redux/actions/app-language.actions';
import { AppUserActions } from '../../../redux/actions/app-user.actions';
import { selectAdminMenuInit, selectAdminMenuShow } from '../../../redux/selectors/app-admin.selector';
import { selectHeaderMenuInit } from '../../../redux/selectors/app-config.selector';
import {
    selectDefaultLanguage,
    selectLanguageMenuInit,
    selectLanguageMenuShow,
} from '../../../redux/selectors/app-language.selector';
import { selectColorScheme } from '../../../redux/selectors/app-theme.selector';
import { selectIsAdmin, selectToken } from '../../../redux/selectors/app-user.selector';
import { Schemes } from '../../models/enums/constants';
import { LayoutService } from '../../services/layout.service';
import { HeaderMenuComponent } from './ui/header-menu/header-menu.component';
import { LanguageMenuComponent } from './ui/language-menu/language-menu.component';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        MenuModule,
        HeaderMenuComponent,
        ButtonModule,
        TagModule,
        LanguageMenuComponent,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    private store = inject(Store);

    public adminMenu!: Signal<MenuItem[]>;
    public adminMenuShow!: Signal<boolean>;
    public adminMenuAvailable!: Signal<boolean>;

    public languageMenu!: Signal<MenuItem[]>;
    public languageMenuShow!: Signal<boolean>;

    public headerMenu!: Signal<MenuItem[]>;

    public colorScheme!: Signal<string>;

    public lang!: Signal<string>;
    public token!: Signal<string | null>;

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private readonly translateService: TranslateService
    ) {
        const adminMenu = this.store.select(selectAdminMenuInit);
        this.adminMenu = toSignal(adminMenu, { initialValue: [] });

        const adminMenuShow$ = this.store.select(selectAdminMenuShow);
        this.adminMenuShow = toSignal(adminMenuShow$, { initialValue: false });

        const adminMenuAvailable$ = this.store.select(selectIsAdmin);

        this.adminMenuAvailable = toSignal(adminMenuAvailable$, { initialValue: false });

        const languageMenu$ = this.store.select(selectLanguageMenuInit);
        this.languageMenu = toSignal(languageMenu$, { initialValue: [] });

        const languageMenuShow$ = this.store.select(selectLanguageMenuShow);
        this.languageMenuShow = toSignal(languageMenuShow$, { initialValue: false });

        const colorScheme$ = this.store.select(selectColorScheme);
        this.colorScheme = toSignal(colorScheme$, { initialValue: Schemes.LIGHT });

        const headerMenu$ = this.store.select(selectHeaderMenuInit);
        this.headerMenu = toSignal(headerMenu$, { initialValue: [] });

        const lang$ = this.store.select(selectDefaultLanguage);
        this.lang = toSignal(lang$, { initialValue: this.translateService.currentLang });

        const token$ = this.store.select(selectToken);
        this.token = toSignal(token$, { initialValue: null });
    }

    public handleOpenAdminMenu(): void {
        if (!this.adminMenuShow()) {
            this.store.dispatch(AppAdminActions.openAdminMenu());
        }
    }

    public handleCloseAdminMenu(): void {
        if (this.adminMenuShow()) {
            this.store.dispatch(AppAdminActions.closeAdminMenu());
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

    logout(): void {
        this.store.dispatch(AppUserActions.logOut());
    }
}
