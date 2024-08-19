import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { selectLoaderState } from '../../../redux/selectors/app-config.selector';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [ConfirmDialogModule, ButtonModule, BlockUIModule, ProgressSpinnerModule],
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.scss',
})
export class LoaderComponent {
    private store = inject(Store);

    public loaderState!: Signal<boolean>;

    constructor() {
        const loaderState$ = this.store.select(selectLoaderState);
        this.loaderState = toSignal(loaderState$, { initialValue: false });
    }
}
