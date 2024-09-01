import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { UserRole } from '../../core/models/user/user.model';

export const AppUserActions = createActionGroup({
    source: 'APP User',
    events: {
        'Log In': props<{ email: string; token: string }>(),
        'Log Out': emptyProps(),
        'Post Load User Data': emptyProps(),
        'Log Out Delete Token': emptyProps(),
        'Log Out Success': emptyProps(),
        'Update user data': props<{ email: string | null; name: string | null; role: UserRole | null }>(),
    },
});
