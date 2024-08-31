import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { PaginationSize } from '../../core/models/enums/constants';
import { Station } from '../../core/models/station/station.model';

export const AppStationsActions = createActionGroup({
    source: 'APP STATIONS',
    events: {
        'Load Stations': emptyProps(),
        'Lazy Load Stations': emptyProps(),
        'Load Stations Success': props<{ stations: Station[] }>(),
        'Load Stations Failure': props<{ error: string }>(),
        'Stations Load Not Required': emptyProps(),

        'Hide Form Station': emptyProps(),

        'Init Create Station': emptyProps(),
        'Init Edit Station': emptyProps(),

        'Init Save New Station': props<{ station: Station }>(),
        'New Station Saved Success': props<{ station: Station }>(),
        'New Station Saved Failure': props<{ error: string }>(),

        'Init Update Station': props<{ station: Station }>(),
        'Update Station Success': props<{ station: Station }>(),
        'Update Station Failure': props<{ error: string }>(),

        'Init Delete Station': props<{ id: number }>(),
        'Delete Station Success': props<{ id: number }>(),
        'Delete Station Failure': props<{ error: string }>(),

        'Change Pagination': props<{ currentPage: number; pageSize: PaginationSize }>(),
        'Paginate Stations': emptyProps(),
    },
});
