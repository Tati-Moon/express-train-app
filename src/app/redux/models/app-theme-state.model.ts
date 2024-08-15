import { AppThemeFields } from './state-fields';

export interface AppThemeState {
    [AppThemeFields.COLOR_SCHEME]: string;
    [AppThemeFields.THEME]: string;
}
