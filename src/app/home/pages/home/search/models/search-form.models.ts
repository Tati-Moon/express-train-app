import { ControlType } from '../../../../../core/models/enums/control-type';

export enum SearchFormFields {
    FROM_INPUT = 'from',
    TO_INPUT = 'to',
    CALENDER = 'calender',
}

export interface SearchForm {
    [SearchFormFields.FROM_INPUT]: ControlType<string>;
    [SearchFormFields.TO_INPUT]: ControlType<string>;
    [SearchFormFields.CALENDER]: ControlType<Date>;
}
