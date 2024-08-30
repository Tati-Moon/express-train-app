import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, throwError } from 'rxjs';

import { AppConfigActions } from '../../redux/actions/app-config.actions';
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
            return throwError(() => response.error);
        })
    );
};
