import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, throwError } from 'rxjs';

import { AppConfigActions } from '../../redux/actions/app-config.actions';
import { MessagesService } from '../services/messages.service';

export const messagesInterceptor: HttpInterceptorFn = (req, next) => {
    const injector = inject(Injector);
    return next(req).pipe(
        catchError((error) => {
            const store = injector.get(Store);
            const messagesService = injector.get(MessagesService);

            store.dispatch(AppConfigActions.setInvisibleLoader());
            messagesService.sendError(error.message);
            return throwError(() => error);
        })
    );
};
