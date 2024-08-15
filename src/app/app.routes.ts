import { Routes } from '@angular/router';

import { Routers } from './core/models/enums/routers';

export const routes: Routes = [
    { path: '', redirectTo: Routers.MAIN, pathMatch: 'full' },
    {
        path: Routers.EMPTY_ROOT,
        loadComponent: () => import('./core/pages/layout/layout.component').then((c) => c.LayoutComponent),
        children: [
            {
                path: Routers.USER_PROFILE,
                loadComponent: () =>
                    import('./user-profile/pages/user-profile/user-profile.component').then(
                        (c) => c.UserProfileComponent
                    ),
            },
        ],
    },
    {
        path: Routers.AUTH,
        children: [
            {
                path: Routers.LOGIN,
                loadComponent: () => import('./core/pages/login/login.component').then((c) => c.LoginComponent),
            },
            {
                path: Routers.ACCESS,
                loadComponent: () => import('./core/pages/access/access.component').then((c) => c.AccessComponent),
            },
            {
                path: Routers.ERROR,
                loadComponent: () => import('./core/pages/error/error.component').then((c) => c.ErrorComponent),
            },
        ],
    },
    {
        path: Routers.NOT_FOUND,
        loadComponent: () => import('./core/pages/not-found/not-found.component').then((c) => c.NotFoundComponent),
    },

    { path: '**', redirectTo: Routers.NOT_FOUND },
];
