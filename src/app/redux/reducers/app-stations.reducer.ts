import { createReducer, on } from '@ngrx/store';

import { PaginationSize } from '../../core/models/enums/constants';
import { AppStationsActions } from '../actions/app-station.actions';
import { AppStationsState } from '../models/app-stations-state';
import { AppStationFields } from '../models/state-fields';

export const initialState: AppStationsState = {
    [AppStationFields.STATIONS]: [],
    [AppStationFields.SHOW_STATION_FORM]: false,
    [AppStationFields.STATION_FORM_MODE]: null,
    [AppStationFields.CURRENT_PAGE]: 0,
    [AppStationFields.PAGE_SIZE]: PaginationSize.TEN,
};

export const appStationsReducer = createReducer(
    initialState,
    on(
        AppStationsActions.initCreateStation,
        (state): AppStationsState => ({
            ...state,
            [AppStationFields.SHOW_STATION_FORM]: true,
            [AppStationFields.STATION_FORM_MODE]: 'CREATE',
        })
    ),
    on(
        AppStationsActions.hideFormStation,
        (state): AppStationsState => ({
            ...state,
            [AppStationFields.SHOW_STATION_FORM]: false,
            [AppStationFields.STATION_FORM_MODE]: null,
        })
    ),
    on(
        AppStationsActions.newStationSavedSuccess,
        (state, { station }): AppStationsState => ({
            ...state,
            [AppStationFields.STATIONS]: [...state[AppStationFields.STATIONS], station],
            [AppStationFields.SHOW_STATION_FORM]: false,
            [AppStationFields.STATION_FORM_MODE]: null,
        })
    ),
    on(
        AppStationsActions.loadStationsSuccess,
        (state, { stations }): AppStationsState => ({
            ...state,
            [AppStationFields.STATIONS]: stations,
        })
    ),
    on(
        AppStationsActions.initEditStation,
        (state): AppStationsState => ({
            ...state,
            [AppStationFields.SHOW_STATION_FORM]: true,
            [AppStationFields.STATION_FORM_MODE]: 'EDIT',
        })
    ),
    on(
        AppStationsActions.updateStationSuccess,
        (state, { station }): AppStationsState => ({
            ...state,
            [AppStationFields.SHOW_STATION_FORM]: false,
            [AppStationFields.STATION_FORM_MODE]: null,
            [AppStationFields.STATIONS]: state[AppStationFields.STATIONS].map((item) =>
                item.id === station.id ? station : item
            ),
        })
    ),

    on(
        AppStationsActions.changePagination,
        (state, { currentPage, pageSize }): AppStationsState => ({
            ...state,
            [AppStationFields.CURRENT_PAGE]: currentPage,
            [AppStationFields.PAGE_SIZE]: pageSize,
        })
    )
);
