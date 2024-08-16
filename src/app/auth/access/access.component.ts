import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { Schemes } from '../../core/models/enums/constants';
import { selectColorScheme } from '../../redux/selectors/app-theme.selector';

@Component({
    selector: 'app-access',
    standalone: true,
    imports: [RouterLink, ButtonModule, RippleModule],
    templateUrl: './access.component.html',
    styleUrl: './access.component.scss',
})
export class AccessComponent {
    private store = inject(Store);

    public colorScheme!: Signal<string>;
    constructor() {
        const colorScheme$ = this.store.select(selectColorScheme);
        this.colorScheme = toSignal(colorScheme$, { initialValue: Schemes.LIGHT });
    }
}
