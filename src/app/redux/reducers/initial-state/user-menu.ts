import { MenuItem } from 'primeng/api';

import { Routers } from '../../../core/models/enums/routers';

export const userMenuInitialState: MenuItem[] = [
    {
        label: 'GENERAL.TOPBAR.SETTINGS',
        icon: 'pi pi-user',
    },
    {
        label: 'GENERAL.TOPBAR.PROFILE',
        icon: 'pi pi-cog',
        routerLink: [Routers.USER_PROFILE],
    },
];
