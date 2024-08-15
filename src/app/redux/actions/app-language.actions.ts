import { createActionGroup, props } from '@ngrx/store';

export const AppLanguageActions = createActionGroup({
    source: 'APP LANGUAGE',
    events: {
        'Set New Application Language': props<{ language: string }>(),
    },
});
