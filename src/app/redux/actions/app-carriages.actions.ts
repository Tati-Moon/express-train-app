import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Carriage } from '../../core/models';

export const AppCarriagesActions = createActionGroup({
    source: 'APP CARRIAGES',
    events: {
        'Load Carriages': emptyProps(),
        'Load Carriages Success': props<{ carriages: Carriage[] }>(),
        'Init Create Carriage': emptyProps(),
        'Init Save New Carriage': props<{ carriage: Carriage }>(),
        'New Carriage Saved': props<{ carriage: Carriage }>(),
        'Discard Create Carriage': emptyProps(),
    },
});
