import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { AppEffects } from './redux/effects/app.effects';
import { metaReducers, reducers } from './redux/reducers';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideAnimationsAsync(),
        provideRouter(routes),
        provideHttpClient(withInterceptors([])),
        provideStore(reducers, { metaReducers }),
        provideEffects(AppEffects),
        provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    ],
};
