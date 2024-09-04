import { Routes } from '@angular/router';

import { isAdminGuard } from './core/guards/is-admin.guard';
import { isloggedGuard } from './core/guards/is-logged.guard';
import { isloggedUserGuard } from './core/guards/is-logged-user.guard';
import { Routers } from './core/models/enums/routers';

export const routes: Routes = [
    { path: '', redirectTo: Routers.EMPTY_ROOT, pathMatch: 'full' },
    {
        path: Routers.EMPTY_ROOT,
        loadComponent: () => import('./core/pages/layout/layout.component').then((c) => c.LayoutComponent),
        children: [
            {
                path: Routers.EMPTY_ROOT,
                loadComponent: () => import('./home/pages/home/home.component').then((c) => c.HomeComponent),
            },
            {
                path: Routers.TRIP_WITH_RIDE_ID,
                loadComponent: () => import('./home/pages/trip/trip.component').then((c) => c.TripComponent),
            },
            {
                path: Routers.USER_PROFILE,
                loadComponent: () =>
                    import('./user-profile/pages/user-profile/user-profile.component').then(
                        (c) => c.UserProfileComponent
                    ),
                canActivate: [isloggedUserGuard],
            },
            {
                path: Routers.ORDERS,
                loadComponent: () =>
                    import('./user-profile/pages/orders/orders.component').then((c) => c.OrdersComponent),
                canActivate: [isloggedUserGuard],
            },
            {
                path: Routers.ADMIN,
                children: [
                    {
                        path: Routers.EMPTY_ROOT,
                        loadComponent: () =>
                            import('./admin/pages/admin/admin.component').then((c) => c.AdminComponent),
                        canActivate: [isAdminGuard],
                    },
                    {
                        path: Routers.STATIONS,
                        loadComponent: () =>
                            import('./admin/pages/stations/stations.component').then((c) => c.StationsComponent),
                        canActivate: [isAdminGuard],
                    },
                    {
                        path: Routers.CARRIAGES,
                        loadComponent: () =>
                            import('./admin/pages/carriages/carriages.component').then((c) => c.CarriagesComponent),
                        canActivate: [isAdminGuard],
                    },
                    {
                        path: Routers.ROUTES,
                        loadComponent: () =>
                            import('./admin/pages/routes/routes.component').then((c) => c.RoutesComponent),
                        canActivate: [isAdminGuard],
                    },
                    {
                        path: Routers.ROUTE_WITH_ID,
                        loadComponent: () =>
                            import('./admin/pages/route-info/route-info.component').then((c) => c.RouteInfoComponent),
                        canActivate: [isAdminGuard],
                    },
                ],
            },
        ],
    },
    {
        path: Routers.SIGNIN,
        loadComponent: () => import('./auth/login/login.component').then((c) => c.LoginComponent),
        canActivate: [isloggedGuard],
    },
    {
        path: Routers.SIGNUP,
        loadComponent: () => import('./auth/signup/signup.component').then((c) => c.SignupComponent),
        canActivate: [isloggedGuard],
    },
    {
        path: Routers.ACCESS,
        loadComponent: () => import('./auth/access/access.component').then((c) => c.AccessComponent),
    },
    {
        path: Routers.NOT_FOUND,
        loadComponent: () => import('./core/pages/error/error.component').then((c) => c.ErrorComponent),
    },
    {
        path: Routers.NO_DIRECT_TRAINS_FOUND,
        loadComponent: () =>
            import('./core/components/no-direct-trains-found/no-direct-trains-found.component').then(
                (c) => c.NoDirectTrainsFoundComponent
            ),
    },

    { path: '**', redirectTo: Routers.NOT_FOUND },
];
