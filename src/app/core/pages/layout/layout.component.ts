import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, Renderer2, Signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';

import { selectColorScheme } from '../../../redux/selectors/app-theme.selector';
import { ConfigComponent } from '../../components/config/config.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Schemes } from '../../models/enums/constants';
import { LayoutService } from '../../services/layout.service';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [
        HeaderComponent,
        FooterComponent,
        SidebarComponent,
        ConfigComponent,
        CommonModule,
        RouterModule,
        LoaderComponent,
    ],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnDestroy {
    private store = inject(Store);

    public colorScheme!: Signal<string>;

    overlayMenuOpenSubscription: Subscription;

    menuOutsideClickListener: (() => void) | null = null;

    @ViewChild(SidebarComponent) sidebar!: SidebarComponent;

    @ViewChild(HeaderComponent) header!: HeaderComponent;

    constructor(
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router
    ) {
        const colorScheme$ = this.store.select(selectColorScheme);
        this.colorScheme = toSignal(colorScheme$, { initialValue: Schemes.LIGHT });

        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
                    const isOutsideClicked = !(
                        this.sidebar.el.nativeElement.isSameNode(event.target) ||
                        this.sidebar.el.nativeElement.contains(event.target) ||
                        this.header.menuButton.nativeElement.isSameNode(event.target) ||
                        this.header.menuButton.nativeElement.contains(event.target)
                    );

                    if (isOutsideClicked) {
                        this.hideMenu();
                    }
                });
            }

            if (this.layoutService.state.staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            this.hideMenu();
        });
    }

    hideMenu() {
        this.layoutService.state.overlayMenuActive = false;
        this.layoutService.state.staticMenuMobileActive = false;
        this.layoutService.state.menuHoverActive = false;
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    // eslint-disable-next-line class-methods-use-this
    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    // eslint-disable-next-line class-methods-use-this
    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(
                new RegExp(`(^|\\b)${'blocked-scroll'.split(' ').join('|')}(\\b|$)`, 'gi'),
                ' '
            );
        }
    }

    get containerClass() {
        return {
            'layout-theme-light': this.colorScheme() === Schemes.LIGHT,
            'layout-theme-dark': this.colorScheme() === Schemes.DARK,
            'layout-overlay': this.layoutService.config().menuMode === 'overlay',
            'layout-static': this.layoutService.config().menuMode === 'static',
            'layout-static-inactive':
                this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config().menuMode === 'static',
            'layout-overlay-active': this.layoutService.state.overlayMenuActive,
            'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
            'p-input-filled': this.layoutService.config().inputStyle === 'filled',
            'p-ripple-disabled': !this.layoutService.config().ripple,
        };
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }
}
