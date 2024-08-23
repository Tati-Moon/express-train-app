import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

import { Constants } from '../models/enums/constants';

@Injectable({
    providedIn: 'root',
})
export class MessagesService {
    constructor(
        private message: MessageService,
        private translateService: TranslateService
    ) {}

    public sendError(textMessage: string): void {
        const titleMessage: string = this.translateService.instant('MESSAGES.TITLE.ERROR');
        const textMessageTranslate: string = this.translateService.instant(textMessage);
        this.message.add({
            severity: 'error',
            summary: titleMessage,
            detail: textMessageTranslate,
            life: Constants.TIME_LIFE_MESSAGE,
        });
    }

    public sendSuccess(textMessage: string): void {
        const titleMessage: string = this.translateService.instant('MESSAGES.TITLE.SUCCESS');
        const textMessageTranslate: string = this.translateService.instant(textMessage);
        this.message.add({
            severity: 'success',
            summary: titleMessage,
            detail: textMessageTranslate,
            life: Constants.TIME_LIFE_MESSAGE,
        });
    }

    public sendWarning(textMessage: string): void {
        const titleMessage: string = this.translateService.instant('MESSAGES.TITLE.WARNING');
        const textMessageTranslate: string = this.translateService.instant(textMessage);
        this.message.add({
            severity: 'warn',
            summary: titleMessage,
            detail: textMessageTranslate,
            life: Constants.TIME_LIFE_MESSAGE,
        });
    }
}
