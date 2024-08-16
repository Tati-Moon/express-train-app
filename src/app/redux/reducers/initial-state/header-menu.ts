import { MenuItem } from 'primeng/api';

import { Routers, RoutersParams } from '../../../core/models/enums/routers';

export const headerMenuGuestInitialState: MenuItem[] = [
    { label: 'GENERAL.SIDEBAR.HOME', icon: 'pi pi-fw pi-home', routerLink: [Routers.EMPTY_ROOT] },
    {
        label: 'GENERAL.SIDEBAR.LOGIN',
        icon: 'pi pi-fw pi-sign-in',
        routerLink: [Routers.ROOT, Routers.SIGNIN],
    },
    {
        label: 'GENERAL.SIDEBAR.SIGNUP',
        icon: 'pi pi-fw pi-plus',
        routerLink: [Routers.ROOT, Routers.SIGNUP],
    },
];

export const headerMenuUserInitialState: MenuItem[] = [
    { label: 'GENERAL.SIDEBAR.HOME', icon: 'pi pi-fw pi-home', routerLink: [Routers.EMPTY_ROOT] },
    { label: 'GENERAL.SIDEBAR.USER_PROFILE', icon: 'pi pi-fw pi-user', routerLink: [Routers.USER_PROFILE] },
    { label: 'GENERAL.SIDEBAR.ORDERS', icon: 'pi pi-fw pi-user', routerLink: [Routers.ORDERS] },
];

export const headerMenuAdminInitialState: MenuItem[] = [
    {
        label: 'GENERAL.SIDEBAR.ADMIN.TITLE',
        items: [
            { label: 'GENERAL.SIDEBAR.ADMIN.OVERVIEW', icon: 'pi pi-fw pi-home', routerLink: [Routers.ADMIN] },
            {
                label: 'GENERAL.SIDEBAR.ADMIN.STATIONS',
                icon: 'pi pi-fw pi-user',
                routerLink: [Routers.ADMIN, Routers.STATIONS],
            },
            {
                label: 'GENERAL.SIDEBAR.ADMIN.CARRIAGES',
                icon: 'pi pi-fw pi-user',
                routerLink: [Routers.ADMIN, Routers.CARRIAGES],
            },
            {
                label: 'GENERAL.SIDEBAR.ADMIN.ROUTES',
                icon: 'pi pi-fw pi-user',
                routerLink: [Routers.ADMIN, Routers.ROUTES],
            },
            {
                label: 'GENERAL.SIDEBAR.ADMIN.ROUTE_WITH_ID',
                icon: 'pi pi-fw pi-user',
                routerLink: [Routers.ADMIN, Routers.ROUTE, RoutersParams.ID],
            },
        ],
    },
];
