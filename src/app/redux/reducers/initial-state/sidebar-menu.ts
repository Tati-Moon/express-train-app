import { MenuItem } from 'primeng/api';

import { Routers } from '../../../core/models/enums/routers';
import { headerMenuAdminInitialState } from './header-menu';

export const sidebarMenuGuestInitialState: MenuItem[] = [
    {
        label: 'GENERAL.SIDEBAR.HOME',
        items: [
            { label: 'GENERAL.SIDEBAR.SEARCH', icon: 'pi pi-fw pi-search', routerLink: [Routers.EMPTY_ROOT] },
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
        ],
    },
];

export const sidebarMenuUserInitialState: MenuItem[] = [
    {
        label: 'GENERAL.SIDEBAR.HOME',
        items: [
            { label: 'GENERAL.SIDEBAR.SEARCH', icon: 'pi pi-fw pi-search', routerLink: [Routers.EMPTY_ROOT] },
            { label: 'GENERAL.SIDEBAR.USER_PROFILE', icon: 'pi pi-fw pi-user', routerLink: [Routers.USER_PROFILE] },
            { label: 'GENERAL.SIDEBAR.ORDERS', icon: 'pi pi-fw pi-cart-arrow-down', routerLink: [Routers.ORDERS] },
        ],
    },
];

export const sidebarMenuAdminInitialState: MenuItem[] = [
    {
        label: 'GENERAL.SIDEBAR.HOME',
        items: [
            { label: 'GENERAL.SIDEBAR.SEARCH', icon: 'pi pi-fw pi-search', routerLink: [Routers.EMPTY_ROOT] },
            { label: 'GENERAL.SIDEBAR.USER_PROFILE', icon: 'pi pi-fw pi-user', routerLink: [Routers.USER_PROFILE] },
            { label: 'GENERAL.SIDEBAR.ORDERS', icon: 'pi pi-fw pi-cart-arrow-down', routerLink: [Routers.ORDERS] },
        ],
    },
    {
        label: 'GENERAL.SIDEBAR.ADMIN.TITLE',
        items: [...headerMenuAdminInitialState],
    },
];
