import { MenuItem } from 'primeng/api';

import { AppConfigFields } from './state-fields';

export interface AppAdminState {
    [AppConfigFields.ADMIN_MENU]: MenuItem[];
    [AppConfigFields.ADMIN_MENU_OPEN]: boolean;
    [AppConfigFields.ADMIN_MENU_AVAILABLE]: boolean;
}
