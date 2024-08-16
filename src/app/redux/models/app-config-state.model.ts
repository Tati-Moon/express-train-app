import { MenuItem } from 'primeng/api';

import { AppConfigFields } from './state-fields';

export interface AppConfigState {
    [AppConfigFields.SIDEBAR_MENU]: MenuItem[];
    [AppConfigFields.USER_MENU]: MenuItem[];
    [AppConfigFields.USER_MENU_OPEN]: boolean;
}
