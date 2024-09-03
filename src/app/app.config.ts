import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import localeEn from '@angular/common/locales/en';
import localeRu from '@angular/common/locales/ru';
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
import { MessageService } from 'primeng/api';

import { routes } from './app.routes';
import { messagesInterceptor } from './core/interceptors/messages.interceptor';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { AppAllUsersEffects } from './redux/effects/app-all-users.effects';
import { AppCarriagesEffects } from './redux/effects/app-carriages.effects';
import { AppConfigEffects } from './redux/effects/app-config.effects';
import { AppLanguageEffects } from './redux/effects/app-language.effects';
import { AppOrdersEffects } from './redux/effects/app-orders.effects';
import { AppRoutesEffects } from './redux/effects/app-routes.effects';
import { AppSchedulesEffects } from './redux/effects/app-schedules.effects';
import { AppSearchEffects } from './redux/effects/app-search.effects';
import { AppStationsEffects } from './redux/effects/app-stations.effects';
import { AppTripEffects } from './redux/effects/app-trip.effects';
import { AppUserEffects } from './redux/effects/app-user.effects';
import { metaReducers, reducers } from './redux/reducers';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

registerLocaleData(localeRu, 'ru');
registerLocaleData(localeEn, 'en');

export const appConfig: ApplicationConfig = {
    providers: [
        MessageService,
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideAnimationsAsync(),
        provideRouter(routes),
        provideHttpClient(withInterceptors([messagesInterceptor, tokenInterceptor])),
        provideStore(reducers, { metaReducers }),
        provideEffects(
            AppConfigEffects,
            AppLanguageEffects,
            AppCarriagesEffects,
            AppUserEffects,
            AppStationsEffects,
            AppRoutesEffects,
            AppTripEffects,
            AppSchedulesEffects,
            AppOrdersEffects,
            AppAllUsersEffects,
            AppSearchEffects
        ),
        provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
        importProvidersFrom(
            TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient] },
            })
        ),
        { provide: LOCALE_ID, useValue: 'en-US' },
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'USD' },
        DatePipe,
    ],
};
