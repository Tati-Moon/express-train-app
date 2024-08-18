import { Routes } from '@angular/router';

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
            },
            {
                path: Routers.ORDERS,
                loadComponent: () =>
                    import('./user-profile/pages/orders/orders.component').then((c) => c.OrdersComponent),
            },
            {
                path: Routers.ADMIN,
                children: [
                    {
                        path: Routers.EMPTY_ROOT,
                        loadComponent: () =>
                            import('./admin/pages/admin/admin.component').then((c) => c.AdminComponent),
                    },
                    {
                        path: Routers.STATIONS,
                        loadComponent: () =>
                            import('./admin/pages/stations/stations.component').then((c) => c.StationsComponent),
                    },
                    {
                        path: Routers.CARRIAGES,
                        loadComponent: () =>
                            import('./admin/pages/carriages/carriages.component').then((c) => c.CarriagesComponent),
                    },
                    {
                        path: Routers.ROUTES,
                        loadComponent: () =>
                            import('./admin/pages/routes/routes.component').then((c) => c.RoutesComponent),
                    },
                    {
                        path: Routers.ROUTE_WITH_ID,
                        loadComponent: () =>
                            import('./admin/pages/route-info/route-info.component').then((c) => c.RouteInfoComponent),
                    },
                ],
            },
        ],
    },
    {
        path: Routers.SIGNIN,
        loadComponent: () => import('./auth/login/login.component').then((c) => c.LoginComponent),
    },
    {
        path: Routers.SIGNUP,
        loadComponent: () => import('./auth/signup/signup.component').then((c) => c.SignupComponent),
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
