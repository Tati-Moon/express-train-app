import { FormArray } from '@angular/forms';

import { ControlType } from '../../core/models/enums/control-type';

export enum RideCreateFormFields {
    ID = 'id',
    SEGMENTS = 'segments',
}

export interface RideCreateForm {
    [RideCreateFormFields.ID]: ControlType<number>;
    [RideCreateFormFields.SEGMENTS]: FormArray;
}

export enum PriceCreateFormFields {
    ID = 'id',
    PRICES = 'prices',
}

export interface PriceCreateForm {
    [PriceCreateFormFields.ID]: ControlType<number>;
    [PriceCreateFormFields.PRICES]: FormArray;
}

export enum RideTimeCreateFormFields {
    ARRIVAL = 'arrival',
    DEPARTURE = 'departure',
}

export interface RideTimeCreateForm {
    [RideTimeCreateFormFields.ARRIVAL]: ControlType<string>;
    [RideTimeCreateFormFields.DEPARTURE]: ControlType<string>;
}
