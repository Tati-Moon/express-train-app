import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../../auth/services/auth-service.service';
import { Routers } from '../models/enums/routers';
import { UserRole } from '../models/user/user.model';

export const isAdminGuard: CanActivateFn = () => {
    const router = inject(Router);
    const auth = inject(AuthService);

    if (auth.userRole() === UserRole.MANAGER) {
        return true;
    }
    return router.navigate([Routers.ACCESS]);
};
