import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../../auth/services/auth-service.service';
import { LocalStorageFields, UsersEmail } from '../models/enums/constants';
import { Routers } from '../models/enums/routers';
import { UserRole } from '../models/user/user.model';
import { LocalStorageService } from '../services/local-storage.service';

export const isAdminGuard: CanActivateFn = () => {
    const router = inject(Router);
    const auth = inject(AuthService);
    const localStorage = inject(LocalStorageService);

    if (localStorage.hasItem(LocalStorageFields.TOKEN)) {
        const role = localStorage.getItem(LocalStorageFields.ROLE);
        const email = localStorage.getItem(LocalStorageFields.EMAIL);
        if (auth.userRole() === null) {
            if (role === UserRole.MANAGER && email === UsersEmail.ADMIN) {
                return true;
            }
            return router.navigate([Routers.ROOT]);
        }

        if (auth.userRole() === UserRole.MANAGER) {
            return true;
        }
        return router.navigate([Routers.ROOT]);
    }
    return router.navigate([Routers.ROOT]);
};
