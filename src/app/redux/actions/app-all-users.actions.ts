import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { User } from '../../core/models/user/user.model';

export const AppAllUsersActions = createActionGroup({
    source: 'APP ALL USERS',
    events: {
        'Load All Users': emptyProps(),
        'Skip Load All Users': emptyProps(),
        'Load All Users Success': props<{ allUsers: User[] }>(),
        'Load All Users Failure': props<{ error: string }>(),
    },
});
