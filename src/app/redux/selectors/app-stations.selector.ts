import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Station } from '../../core/models/station/station.model';
import { AppStationsState } from '../models/app-stations-state';
import { AppStationFields, StateFields } from '../models/state-fields';
import { selectActiveOrders } from './app-orders.selector';

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

export const selectStationById = (id: number) =>
    createSelector(selectStations, (stations: Station[]) => stations.find((station) => station.id === id) || null);

export const selectIsStationInActiveRide = (stationId: number) =>
    createSelector(selectActiveOrders, (orders) => orders.some((order) => order.path.includes(stationId)));
