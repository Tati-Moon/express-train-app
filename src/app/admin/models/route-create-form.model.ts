import { FormArray } from '@angular/forms';

import { ControlType } from '../../core/models/enums/control-type';
import { ICarriage, IStation } from './station.interface';

export enum RouteCreateFormFields {
    ID = 'id',
    PATH = 'path',
    CARRIAGES = 'carriages',
    CARRIAGES_LIST = 'carriages_list',
    STATIONS_LIST = 'stations_list',
    CITIES = 'cities',
}

export type RouteFormMode = 'CREATE' | 'EDIT' | 'DELETE' | null;

export interface RouteCreateForm {
    [RouteCreateFormFields.ID]: ControlType<number>;
    [RouteCreateFormFields.PATH]: FormArray;
    [RouteCreateFormFields.CARRIAGES]: FormArray;
    [RouteCreateFormFields.STATIONS_LIST]: ControlType<IStation[]>;
    [RouteCreateFormFields.CARRIAGES_LIST]: ControlType<ICarriage[]>;
    [RouteCreateFormFields.CITIES]: FormArray;
}
