import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AppLanguageActions = createActionGroup({
    source: 'APP LANGUAGE',
    events: {
        'Init Default Application Language': emptyProps(),
        'Update Application Language': props<{ language: string }>(),
        'Set New Application Language': props<{ language: string }>(),
        'Open Language Menu': emptyProps(),
        'Close Language Menu': emptyProps(),
    },
});
