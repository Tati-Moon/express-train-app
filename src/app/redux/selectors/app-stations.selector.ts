import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStationsState } from '../models/app-stations-state';
import { AppStationFields, StateFields } from '../models/state-fields';

export const selectAppStations = createFeatureSelector<AppStationsState>(StateFields.APP_STATIONS);

export const selectStations = createSelector(
    selectAppStations,
    (state: AppStationsState) => state[AppStationFields.STATIONS]
);

export const selectShowFormState = createSelector(
    selectAppStations,
    (state: AppStationsState) => state[AppStationFields.SHOW_STATION_FORM]
);

export const selectFormMode = createSelector(
    selectAppStations,
    (state: AppStationsState) => state[AppStationFields.STATION_FORM_MODE]
);

export const selectPaginatedStations = createSelector(selectAppStations, (state: AppStationsState) => {
    const currentPage = state[AppStationFields.CURRENT_PAGE];
    const pageSize = state[AppStationFields.PAGE_SIZE];
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return state[AppStationFields.STATIONS].slice(start, end);
});

export const selectCurrentPage = createSelector(
    selectAppStations,
    (state: AppStationsState) => state[AppStationFields.CURRENT_PAGE]
);

export const selectPageSize = createSelector(
    selectAppStations,
    (state: AppStationsState) => state[AppStationFields.PAGE_SIZE]
);

export const selectTotalRecords = createSelector(selectStations, (stations) => stations.length);
