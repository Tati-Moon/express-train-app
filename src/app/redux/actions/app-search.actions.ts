import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Carriage } from '../../core/models';
import { Station } from '../../core/models/station/station.model';

export const AppSearchActions = createActionGroup({
    source: 'APP SEARCH',
    events: {
        'Load Search Data': emptyProps(),
        'Load Search Data Success': props<{ stations: Station[]; carriages: Carriage[] }>(),
        'Load Search Data Failure': props<{ error: string }>(),
        'Search Data Load Not Required': emptyProps(),

        'Init Edit Station': emptyProps(),
    },
});
