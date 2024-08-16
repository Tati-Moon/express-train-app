import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';

import { selectSidebarInit } from '../../../../../redux/selectors/app-config.selector';
import { LayoutService } from '../../../../services/layout.service';
import { AppMenuitemComponent } from './app.menuitem.component';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [AppMenuitemComponent, CommonModule],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss',
})
export class MenuComponent {
    private store = inject(Store);
    public modelMenu!: Signal<MenuItem[]>;

    constructor(
        public layoutService: LayoutService,
        private readonly translateService: TranslateService
    ) {
        const modelMenu$ = this.store.select(selectSidebarInit);
        this.modelMenu = toSignal(modelMenu$, { initialValue: [] });
    }
}
