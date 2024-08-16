import { effect, inject, Injectable, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { selectColorScheme } from '../../redux/selectors/app-theme.selector';
import { Schemes } from '../models/enums/constants';

export interface AppConfig {
    inputStyle: string;
    colorScheme: string;
    theme: string;
    ripple: boolean;
    menuMode: string;
    scale: number;
}

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class LayoutService {
    private store = inject(Store);

    public colorScheme!: Signal<string>;

    appConfig: AppConfig = {
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'static',
        colorScheme: 'light',
        theme: 'lara-light-indigo',
        scale: 14,
    };

    config = signal<AppConfig>(this.appConfig);

    state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
    };

    private configUpdate = new Subject<AppConfig>();

    private overlayOpen = new Subject<void | null>();

    configUpdate$ = this.configUpdate.asObservable();

    overlayOpen$ = this.overlayOpen.asObservable();

    constructor() {
        effect(() => {
            const config = this.config();
            if (this.updateStyle(config)) {
                this.changeTheme();
            }
            this.changeScale(config.scale);
            this.onConfigUpdate();
        });

        const colorScheme$ = this.store.select(selectColorScheme);
        this.colorScheme = toSignal(colorScheme$, { initialValue: Schemes.LIGHT });
    }

    updateStyle(config: AppConfig) {
        return config.theme !== this.appConfig.theme || config.colorScheme !== this.appConfig.colorScheme;
    }

    onMenuToggle() {
        if (this.isOverlay()) {
            this.state.overlayMenuActive = !this.state.overlayMenuActive;
            if (this.state.overlayMenuActive) {
                this.overlayOpen.next(null);
            }
        }

        if (this.isDesktop()) {
            this.state.staticMenuDesktopInactive = !this.state.staticMenuDesktopInactive;
        } else {
            this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;

            if (this.state.staticMenuMobileActive) {
                this.overlayOpen.next(null);
            }
        }
    }

    showProfileSidebar() {
        this.state.profileSidebarVisible = !this.state.profileSidebarVisible;
        if (this.state.profileSidebarVisible) {
            this.overlayOpen.next(null);
        }
    }

    showConfigSidebar() {
        this.state.configSidebarVisible = true;
    }

    isOverlay() {
        return this.config().menuMode === 'overlay';
    }

    // eslint-disable-next-line class-methods-use-this
    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return !this.isDesktop();
    }

    onConfigUpdate() {
        this.appConfig = { ...this.config() };
        this.configUpdate.next(this.config());
    }

    changeTheme() {
        const config = this.config();
        const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
        const themeLinkHref = themeLink.getAttribute('href')!;
        const newHref = themeLinkHref
            .split('/')
            .map((el) => {
                if (el === this.appConfig.theme) {
                    return config.theme;
                }
                if (el === `theme-${this.appConfig.colorScheme}`) {
                    return `theme-${config.colorScheme}`;
                }
                return el;
            })
            .join('/');

        this.replaceThemeLink(newHref);
    }

    // eslint-disable-next-line class-methods-use-this
    replaceThemeLink(href: string) {
        const id = 'theme-css';
        const themeLink = <HTMLLinkElement>document.getElementById(id);
        const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

        cloneLinkElement.setAttribute('href', href);
        cloneLinkElement.setAttribute('id', `${id}-clone`);

        themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);
        cloneLinkElement.addEventListener('load', () => {
            themeLink.remove();
            cloneLinkElement.setAttribute('id', id);
        });
    }

    // eslint-disable-next-line class-methods-use-this
    changeScale(value: number) {
        document.documentElement.style.fontSize = `${value}px`;
    }
}
