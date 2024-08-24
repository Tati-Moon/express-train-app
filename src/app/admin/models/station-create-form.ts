import { FormArray } from '@angular/forms';

import { ControlType } from '../../core/models/enums/control-type';

export enum StationCreateFormFields {
    ID = 'id',
    CITY = 'city',
    LATITUDE = 'latitude',
    LONGITUDE = 'longitude',
    CONNECTED_TO = 'connectedTo',
    STATIONS = 'stations',
}
export enum ConnectedStationCreateFormFields {
    ID = 'id',
    CITY = 'city',
    LATITUDE = 'latitude',
    LONGITUDE = 'longitude',
    DISTANCE = 'distance',
}
export interface StationCreateForm {
    [StationCreateFormFields.ID]: ControlType<number>;
    [StationCreateFormFields.CITY]: ControlType<string>;
    [StationCreateFormFields.LATITUDE]: ControlType<number>;
    [StationCreateFormFields.LONGITUDE]: ControlType<number>;
    [StationCreateFormFields.CONNECTED_TO]: FormArray;
    [StationCreateFormFields.STATIONS]: FormArray;
}
export interface ConnectedStationCreateForm {
    [ConnectedStationCreateFormFields.ID]: ControlType<number>;
    [ConnectedStationCreateFormFields.CITY]: ControlType<string>;
    [ConnectedStationCreateFormFields.LATITUDE]: ControlType<number>;
    [ConnectedStationCreateFormFields.LONGITUDE]: ControlType<number>;
    [ConnectedStationCreateFormFields.DISTANCE]: ControlType<number>;
}
