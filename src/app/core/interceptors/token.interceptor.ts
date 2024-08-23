import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { LocalStorageFields } from '../models/enums/constants';
import { LocalStorageService } from '../services/local-storage.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const localStorageService = inject(LocalStorageService);
    const token = localStorageService.getItem<string>(LocalStorageFields.TOKEN) ?? null;

    if (!token) return next(req);

    const newReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
    });

    return next(newReq);
};
