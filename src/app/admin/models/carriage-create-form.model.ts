import { ControlType } from '../../core/models/enums/control-type';

export enum CarriageCreateFormFields {
    CODE = 'code',
    NAME = 'name',
    LEFT_SEATS = 'leftSeats',
    RIGHT_SEATS = 'rightSeats',
    ROWS = 'rows',
}
export interface CarriageCreateForm {
    [CarriageCreateFormFields.CODE]: ControlType<string>;
    [CarriageCreateFormFields.NAME]: ControlType<string>;
    [CarriageCreateFormFields.LEFT_SEATS]: ControlType<number>;
    [CarriageCreateFormFields.RIGHT_SEATS]: ControlType<number>;
    [CarriageCreateFormFields.ROWS]: ControlType<number>;
}
