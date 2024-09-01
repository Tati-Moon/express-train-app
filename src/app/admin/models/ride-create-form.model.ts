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

export enum CreateRideFormFields {
    ID = 'id',
    SEGMENTS = 'segments',
    CreateSegmentsFormFields = 'CreateSegmentsFormFields',
}

export interface CreateRideForm {
    [CreateRideFormFields.ID]: ControlType<number>;
    [CreateRideFormFields.SEGMENTS]: FormArray;
}

export enum CreateSegmentsFormFields {
    ID = 'id',
    CITY = 'city',
    PRICES = 'prices',
    TIME = 'time',
}

export interface CreateSegmentsForm {
    [CreateSegmentsFormFields.ID]: ControlType<number>;
    [CreateSegmentsFormFields.CITY]: ControlType<string>;
    [CreateSegmentsFormFields.PRICES]: FormArray;
    [CreateSegmentsFormFields.TIME]: FormArray;
}

export enum CreatePriceFormFields {
    ID = 'id',
    NAME = 'name',
    VALUE = 'value',
}

export interface CreatePriceForm {
    [CreatePriceFormFields.ID]: ControlType<string>;
    [CreatePriceFormFields.NAME]: ControlType<string>;
    [CreatePriceFormFields.VALUE]: ControlType<number>;
}
