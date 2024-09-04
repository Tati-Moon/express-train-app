import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { LocalStorageFields } from '../models/enums/constants';
import { Routers } from '../models/enums/routers';
import { LocalStorageService } from '../services/local-storage.service';

export const isloggedGuard: CanActivateFn = () => {
    const router = inject(Router);
    const localStorage = inject(LocalStorageService);

    if (localStorage.hasItem(LocalStorageFields.TOKEN)) {
        return router.navigate([Routers.ROOT]);
    }
    return true;
};
