import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppRoutesState } from '../models/app-routes-state.model';
import { AppRouteFields, StateFields } from '../models/state-fields';

export const selectAppRoutes = createFeatureSelector<AppRoutesState>(StateFields.APP_ROUTES);

export const selectRoutes = createSelector(selectAppRoutes, (state: AppRoutesState) => state[AppRouteFields.ROUTES]);

export const selectShowFormState = createSelector(
    selectAppRoutes,
    (state: AppRoutesState) => state[AppRouteFields.SHOW_ROUTE_FORM]
);

export const selectFormMode = createSelector(
    selectAppRoutes,
    (state: AppRoutesState) => state[AppRouteFields.ROUTE_FORM_MODE]
);

export const selectPaginatedRoutes = createSelector(selectAppRoutes, (state: AppRoutesState) => {
    const currentPage = state[AppRouteFields.CURRENT_PAGE];
    const pageSize = state[AppRouteFields.PAGE_SIZE];
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return state[AppRouteFields.ROUTES].slice(start, end);
});

export const selectCurrentPage = createSelector(
    selectAppRoutes,
    (state: AppRoutesState) => state[AppRouteFields.CURRENT_PAGE]
);

export const selectPageSize = createSelector(
    selectAppRoutes,
    (state: AppRoutesState) => state[AppRouteFields.PAGE_SIZE]
);

export const selectTotalRecords = createSelector(selectRoutes, (routes) => routes.length);
