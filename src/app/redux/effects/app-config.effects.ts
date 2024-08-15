import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class AppConfigEffects {
    constructor(private actions$: Actions) {}
}
