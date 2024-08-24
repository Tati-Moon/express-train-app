import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { UserRole } from '../models/app-user-state.model';

export const AppUserActions = createActionGroup({
    source: 'APP User',
    events: {
        'Log In': props<{ email: string; token: string }>(),
        'Log Out': emptyProps(),
        'Post Load User Data': emptyProps(),
        'Log Out Success': emptyProps(),
        'Update user data': props<{ email: string | null; name: string | null; role: UserRole | null }>(),
    },
});
