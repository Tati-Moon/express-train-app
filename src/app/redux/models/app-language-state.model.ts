import { MenuItem } from 'primeng/api';

import { AppLanguageFields } from './state-fields';

export interface AppLanguageState {
    [AppLanguageFields.DEFAULT_LANGUAGE]: string;
    [AppLanguageFields.LANGUAGE_MENU]: MenuItem[];
    [AppLanguageFields.LANGUAGE_MENU_OPEN]: boolean;
}
