import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AppUserActions = createActionGroup({
    source: 'APP User',
    events: {
        'Log In': props<{ email: string; token: string }>(),
        'Log Out': emptyProps(),
        'Log Out Success': emptyProps(),
        'Update user data': props<{ email: string; name: string; role: string }>(),
    },
});
