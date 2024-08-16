import { createActionGroup, emptyProps } from '@ngrx/store';

export const AppConfigActions = createActionGroup({
    source: 'APP CONFIG',
    events: {
        'Init Default Application Config': emptyProps(),
        'Open User Profile Menu': emptyProps(),
        'Close User Profile Menu': emptyProps(),
    },
});
