import { MenuItem } from 'primeng/api';

import { AppConfigFields } from './state-fields';

export interface AppConfigState {
    [AppConfigFields.SIDEBAR_MENU]: MenuItem[];
    [AppConfigFields.HEADER_MENU]: MenuItem[];
    [AppConfigFields.SHOW_LOADER]: boolean;
}
