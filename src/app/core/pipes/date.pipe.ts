import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { selectDefaultLanguage } from '../../redux/selectors/app-language.selector';

@Pipe({
    name: 'date',
    standalone: true,
    pure: false,
})
export class AppDatePipe implements PipeTransform {
    private lastLang!: string;
    private lastResult: string | null = null;
    public lang!: Signal<string>;

    constructor(
        private date: DatePipe,
        private store: Store,
        private translateService: TranslateService
    ) {
        const lang$ = this.store.select(selectDefaultLanguage);
        this.lang = toSignal(lang$, { initialValue: this.translateService.currentLang });
    }

    transform(value: Date | string | number, format?: string, timezone?: string, locale?: string): string | null;
    transform(value: null | undefined, format?: string, timezone?: string, locale?: string): null;
    transform(
        value: Date | string | number | null | undefined,
        format?: string,
        timezone?: string,
        locale?: string
    ): string | null {
        const currentLang = this.lang();

        if (this.lastLang !== currentLang || this.lastResult === null) {
            this.lastLang = currentLang;
            this.lastResult = this.date.transform(value, format, timezone, locale || currentLang);
        }

        return this.lastResult;
    }
}
