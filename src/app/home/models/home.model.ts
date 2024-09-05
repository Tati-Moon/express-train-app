import { ControlType } from '../../core/models/enums/control-type';

export enum SearchFormFields {
    FROM_CITY = 'from_city',
    TO_CITY = 'to_city',
    DATE = 'date',
    TIME = 'time',
}

export interface SearchForm {
    [SearchFormFields.FROM_CITY]: ControlType<string>;
    [SearchFormFields.TO_CITY]: ControlType<string>;
    [SearchFormFields.DATE]: ControlType<Date | null>;
    [SearchFormFields.TIME]: ControlType<string | null>;
}
