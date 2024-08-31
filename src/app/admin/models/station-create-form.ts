import { FormArray } from '@angular/forms';

import { ControlType } from '../../core/models/enums/control-type';

export enum StationCreateFormFields {
    ID = 'id',
    CITY = 'city',
    LATITUDE = 'latitude',
    LONGITUDE = 'longitude',
    CONNECTED_TO = 'connectedTo',
}

export type StationFormMode = 'CREATE' | 'EDIT' | 'DELETE' | null;

export interface StationCreateForm {
    [StationCreateFormFields.ID]: ControlType<number>;
    [StationCreateFormFields.CITY]: ControlType<string>;
    [StationCreateFormFields.LATITUDE]: ControlType<number>;
    [StationCreateFormFields.LONGITUDE]: ControlType<number>;
    [StationCreateFormFields.CONNECTED_TO]: FormArray;
}
