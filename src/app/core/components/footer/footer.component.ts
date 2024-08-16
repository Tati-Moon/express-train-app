import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';

import { selectColorScheme } from '../../../redux/selectors/app-theme.selector';
import { Schemes } from '../../models/enums/constants';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
})
export class FooterComponent {
    private store = inject(Store);

    public colorScheme!: Signal<string>;
    constructor() {
        const colorScheme$ = this.store.select(selectColorScheme);
        this.colorScheme = toSignal(colorScheme$, { initialValue: Schemes.LIGHT });
    }
}
