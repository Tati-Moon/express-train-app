import { Component, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { Subscription } from 'rxjs';

import { Languages } from './core/models/enums/constants';
import { selectDefaultLanguage } from './redux/selectors/app-language.selector';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ButtonModule, CalendarModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
    private language$!: Subscription;

    private store = inject(Store);
    private defaultLanguage: Signal<string>;

    constructor(
        private config: PrimeNGConfig,
        private translateService: TranslateService
    ) {
        const defaultLanguage$ = this.store.select(selectDefaultLanguage);
        this.defaultLanguage = toSignal(defaultLanguage$, { initialValue: Languages.EN });
    }

    ngOnInit() {
        this.translateService.setDefaultLang(this.defaultLanguage());
        this.translateService.use(this.defaultLanguage());
        this.language$ = this.translateService.get('primeng').subscribe((res) => this.config.setTranslation(res));
    }

    ngOnDestroy() {
        if (this.language$) {
            this.language$.unsubscribe();
        }
    }
}
