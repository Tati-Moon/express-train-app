import { createActionGroup, props } from '@ngrx/store';

export const AppThemeActions = createActionGroup({
    source: 'APP THEME',
    events: {
        'Set Color Scheme': props<{ colorScheme: string; theme: string }>(),
    },
});
