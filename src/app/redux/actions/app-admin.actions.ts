import { createActionGroup, emptyProps } from '@ngrx/store';

export const AppAdminActions = createActionGroup({
    source: 'APP ADMIN',
    events: {
        'Open Admin Menu': emptyProps(),
        'Close Admin Menu': emptyProps(),
        'Toggle Available Admin Menu': emptyProps(),
    },
});
