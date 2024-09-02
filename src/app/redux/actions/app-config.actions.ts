import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { MenuItem } from 'primeng/api';

export const AppConfigActions = createActionGroup({
    source: 'APP CONFIG',
    events: {
        'Init Default Application Config': emptyProps(),
        'Open User Profile Menu': emptyProps(),
        'Close User Profile Menu': emptyProps(),
        'Init Default State Header Menu': emptyProps(),
        'Set New State Header Menu': props<{ headerMenu: MenuItem[]; sidebarMenu: MenuItem[] }>(),
        'Set Visible Loader': emptyProps(),
        'Set Invisible Loader': emptyProps(),
    },
});
