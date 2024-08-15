import { MenuItem } from 'primeng/api';

import { Routers } from '../../../core/models/enums/routers';

export const sidebarMenuInitialState: MenuItem[] = [
    {
        label: 'GENERAL.SIDEBAR.HOME',
        items: [
            { label: 'GENERAL.SIDEBAR.USER_PROFILE', icon: 'pi pi-fw pi-home', routerLink: [Routers.USER_PROFILE] },
            {
                label: 'GENERAL.SIDEBAR.LOGIN',
                icon: 'pi pi-fw pi-sign-in',
                routerLink: [Routers.ROOT, Routers.AUTH, Routers.LOGIN],
            },
            {
                label: 'GENERAL.SIDEBAR.ACCESS',
                icon: 'pi pi-fw pi-lock',
                routerLink: [Routers.ROOT, Routers.AUTH, Routers.ACCESS],
            },
            {
                label: 'GENERAL.SIDEBAR.ERROR',
                icon: 'pi pi-fw pi-times-circle',
                routerLink: [Routers.ROOT, Routers.AUTH, Routers.ERROR],
            },
        ],
    },
];
