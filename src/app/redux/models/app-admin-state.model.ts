import { MenuItem } from 'primeng/api';

import { AppAdminFields } from './state-fields';

export interface AppAdminState {
    [AppAdminFields.ADMIN_MENU]: MenuItem[];
    [AppAdminFields.ADMIN_MENU_OPEN]: boolean;
    [AppAdminFields.ADMIN_MENU_AVAILABLE]: boolean;
}
