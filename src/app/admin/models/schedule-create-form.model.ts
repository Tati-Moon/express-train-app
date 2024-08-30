import { FormArray } from '@angular/forms';

import { ControlType } from '../../core/models/enums/control-type';

export enum ScheduleCreateFormFields {
    ID = 'id',
    PATH = 'path',
    CARRIAGES = 'carriages',
    SCHEDULE = 'schedule',
    STATIONS_LIST = 'stations_list',
    CARRIAGES_LIST = 'carriages_list',
}

export type ScheduleFormMode = 'CREATE' | 'EDIT' | 'DELETE' | null;

export interface ScheduleCreateForm {
    [ScheduleCreateFormFields.ID]: ControlType<number>;
    [ScheduleCreateFormFields.PATH]: FormArray;
    [ScheduleCreateFormFields.CARRIAGES]: FormArray;
    [ScheduleCreateFormFields.SCHEDULE]: FormArray;
    [ScheduleCreateFormFields.STATIONS_LIST]: FormArray;
    [ScheduleCreateFormFields.CARRIAGES_LIST]: FormArray;
}
