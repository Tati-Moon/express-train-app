import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { PaginationSize } from '../../core/models/enums/constants';
import { Route } from '../../core/models/route/route.model';

export const AppRoutesActions = createActionGroup({
    source: 'APP ROUTES',
    events: {
        'Load Routes': emptyProps(),
        'Load Routes Success': props<{ routes: Route[] }>(),
        'Load Routes Failure': props<{ error: string }>(),

        'Hide Form Route': emptyProps(),

        'Init Create Route': emptyProps(),
        'Init Edit Route': emptyProps(),

        'Init Save New Route': props<{ route: Route }>(),
        'New Route Saved Success': props<{ route: Route }>(),
        'New Route Saved Failure': props<{ error: string }>(),

        'Init Update Route': props<{ id: number; route: Route }>(),
        'Update Route Success': props<{ route: Route }>(),
        'Update Route Failure': props<{ error: string }>(),

        'Init Delete Route': props<{ id: number }>(),
        'Delete Route Success': props<{ id: number }>(),
        'Delete Route Failure': props<{ error: string }>(),

        'Change Pagination': props<{ currentPage: number; pageSize: PaginationSize }>(),
        'Paginate Stations': emptyProps(),
    },
});
