import { MenuItem } from 'primeng/api';

import { Routers } from '../../../core/models/enums/routers';
import { headerMenuAdminInitialState } from './header-menu';

export const sidebarMenuInitialState: MenuItem[] = [
    {
        label: 'GENERAL.SIDEBAR.HOME',
        items: [
            { label: 'GENERAL.SIDEBAR.HOME', icon: 'pi pi-fw pi-home', routerLink: [Routers.EMPTY_ROOT] },
            { label: 'GENERAL.SIDEBAR.TRIP', icon: 'pi pi-fw pi-car', routerLink: [Routers.TRIP_WITH_RIDE_ID] },
            { label: 'GENERAL.SIDEBAR.USER_PROFILE', icon: 'pi pi-fw pi-user', routerLink: [Routers.USER_PROFILE] },
            { label: 'GENERAL.SIDEBAR.ORDERS', icon: 'pi pi-fw pi-cart-arrow-down', routerLink: [Routers.ORDERS] },
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
            {
                label: 'GENERAL.SIDEBAR.ACCESS',
                icon: 'pi pi-fw pi-lock',
                routerLink: [Routers.ROOT, Routers.ACCESS],
            },
            {
                label: 'GENERAL.SIDEBAR.ERROR',
                icon: 'pi pi-fw pi-times-circle',
                routerLink: [Routers.ROOT, Routers.ERROR],
            },
            {
                label: 'GENERAL.SIDEBAR.NO_DIRECT_TRAINS_FOUND',
                icon: 'pi pi-fw pi-times-circle',
                routerLink: [Routers.ROOT, Routers.NO_DIRECT_TRAINS_FOUND],
            },
        ],
    },
    {
        label: 'GENERAL.SIDEBAR.ADMIN.TITLE',
        items: [...headerMenuAdminInitialState],
    },
];
