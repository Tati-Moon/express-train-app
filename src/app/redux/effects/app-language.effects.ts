import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';

import { AppLanguageActions } from '../actions/app-language.actions';

@Injectable()
export class AppLanguageEffects {
    constructor(
        private actions$: Actions,
        private translateService: TranslateService
    ) {}

    updateLanguage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppLanguageActions.updateApplicationLanguage),
            map((action) => {
                const { language } = action;
                this.translateService.use(language);
                return AppLanguageActions.setNewApplicationLanguage({ language });
            })
        )
    );
}
