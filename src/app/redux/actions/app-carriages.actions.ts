import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Carriage } from '../../core/models';

export const AppCarriagesActions = createActionGroup({
    source: 'APP CARRIAGES',
    events: {
        'Load Carriages': emptyProps(),
        'Load Carriages Success': props<{ carriages: Carriage[] }>(),
        'Load Carriages Failure': props<{ error: string }>(),
        'Lazy Load Carriages': emptyProps(),
        'Carriages Load Not Required': emptyProps(),

        'Hide Form Carriage': emptyProps(),

        'Init Create Carriage': emptyProps(),
        'Init Edit Carriage': emptyProps(),

        'Init Save New Carriage': props<{ carriage: Carriage }>(),
        'New Carriage Saved Success': props<{ carriage: Carriage }>(),
        'New Carriage Saved Failure': props<{ error: string }>(),

        'Init Update Carriage': props<{ carriage: Carriage }>(),
        'Update Carriage Success': props<{ carriage: Carriage }>(),
        'Update Carriage Failure': props<{ error: string }>(),
    },
});
