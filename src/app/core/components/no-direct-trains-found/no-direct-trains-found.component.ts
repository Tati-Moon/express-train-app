import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { selectColorScheme } from '../../../redux/selectors/app-theme.selector';
import { Schemes } from '../../models/enums/constants';

@Component({
    selector: 'app-no-root',
    standalone: true,
    imports: [ButtonModule, RouterLink, RippleModule, TranslateModule],
    templateUrl: './no-direct-trains-found.component.html',
    styleUrl: './no-direct-trains-found.component.scss',
})
export class NoDirectTrainsFoundComponent {
    private store = inject(Store);
    public colorScheme!: Signal<string>;

    constructor() {
        const colorScheme$ = this.store.select(selectColorScheme);
        this.colorScheme = toSignal(colorScheme$, { initialValue: Schemes.LIGHT });
    }
}
