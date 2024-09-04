import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../../auth/services/auth-service.service';
import { LocalStorageFields } from '../models/enums/constants';
import { Routers } from '../models/enums/routers';
import { UserRole } from '../models/user/user.model';
import { LocalStorageService } from '../services/local-storage.service';

export const isloggedUserGuard: CanActivateFn = () => {
    const router = inject(Router);
    const auth = inject(AuthService);
    const localStorage = inject(LocalStorageService);

    if (localStorage.hasItem(LocalStorageFields.TOKEN)) {
        const btoaRole = btoa(LocalStorageFields.ROLE as string);
        const role = localStorage.getItem(btoaRole) as string;
        const atobRole = atob(role);

        if (auth.userRole() === null) {
            if (atobRole === UserRole.USER) {
                return true;
            }

            if (atobRole === UserRole.MANAGER) {
                return true;
            }
            return router.navigate([Routers.ROOT]);
        }

        if (auth.userRole() === UserRole.USER) {
            return true;
        }

        if (auth.userRole() === UserRole.MANAGER) {
            return true;
        }

        return router.navigate([Routers.ROOT]);
    }
    return router.navigate([Routers.ROOT]);
};
