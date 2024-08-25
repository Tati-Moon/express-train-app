import { StationFormMode } from '../../admin/models/station-create-form';
import { PaginationSize } from '../../core/models/enums/constants';
import { Station } from '../../core/models/station/station.model';
import { AppStationFields } from './state-fields';

export interface AppStationsState {
    [AppStationFields.STATIONS]: Station[];
    [AppStationFields.SHOW_STATION_FORM]: boolean;
    [AppStationFields.STATION_FORM_MODE]: StationFormMode;
    [AppStationFields.CURRENT_PAGE]: number;
    [AppStationFields.PAGE_SIZE]: PaginationSize;
}
