import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    ApplicationConfig,
    DEFAULT_CURRENCY_CODE,
    importProvidersFrom,
    isDevMode,
    LOCALE_ID,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { AppCarriagesEffects } from './redux/effects/app-carriages.effects';
import { AppConfigEffects } from './redux/effects/app-config.effects';
import { AppLanguageEffects } from './redux/effects/app-language.effects';
import { metaReducers, reducers } from './redux/reducers';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideAnimationsAsync(),
        provideRouter(routes),
        provideHttpClient(withInterceptors([])),
        provideStore(reducers, { metaReducers }),
        provideEffects(AppConfigEffects, AppLanguageEffects, AppCarriagesEffects),
        provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
        importProvidersFrom(
            TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient] },
            })
        ),
        { provide: LOCALE_ID, useValue: 'ru-RU' },
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'RUB' },
    ],
};
