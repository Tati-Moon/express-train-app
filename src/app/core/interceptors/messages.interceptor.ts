import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, debounceTime, tap } from 'rxjs';

import { AppConfigActions } from '../../redux/actions/app-config.actions';
import { Loader } from '../models/enums/constants';
import { MessagesService } from '../services/messages.service';

export const messagesInterceptor: HttpInterceptorFn = (req, next) => {
    const injector = inject(Injector);
    return next(req).pipe(
        catchError((response) => {
            const store = injector.get(Store);
            const messagesService = injector.get(MessagesService);

            const { message } = response.error;

            store.dispatch(AppConfigActions.setInvisibleLoader());
            messagesService.sendError(message);
            return next(req);
        }),
        debounceTime(Loader.TIME_WAIT),
        tap(() => {
            const store = injector.get(Store);
            store.dispatch(AppConfigActions.setInvisibleLoader());
        })
    );
};
