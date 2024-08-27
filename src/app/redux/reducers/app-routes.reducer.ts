import { createReducer, on } from '@ngrx/store';

import { PaginationSize } from '../../core/models/enums/constants';
import { Route } from '../../core/models/route/route.model';
import { AppRoutesActions } from '../actions/app-routes.actions';
import { AppRoutesState } from '../models/app-routes-state.model';
import { AppRouteFields } from '../models/state-fields';

export const initialState: AppRoutesState = {
    [AppRouteFields.ROUTES]: [],
    [AppRouteFields.SHOW_ROUTE_FORM]: false,
    [AppRouteFields.ROUTE_FORM_MODE]: null,
    [AppRouteFields.CURRENT_PAGE]: 0,
    [AppRouteFields.PAGE_SIZE]: PaginationSize.TEN,
};

export const appRoutesReducer = createReducer(
    initialState,
    on(
        AppRoutesActions.initCreateRoute,
        (state): AppRoutesState => ({
            ...state,
            [AppRouteFields.SHOW_ROUTE_FORM]: true,
            [AppRouteFields.ROUTE_FORM_MODE]: 'CREATE',
        })
    ),
    on(
        AppRoutesActions.hideFormRoute,
        (state): AppRoutesState => ({
            ...state,
            [AppRouteFields.SHOW_ROUTE_FORM]: false,
            [AppRouteFields.ROUTE_FORM_MODE]: null,
        })
    ),
    on(
        AppRoutesActions.newRouteSavedSuccess,
        (state, { route }): AppRoutesState => ({
            ...state,
            [AppRouteFields.ROUTES]: [...state[AppRouteFields.ROUTES], route],
            [AppRouteFields.SHOW_ROUTE_FORM]: false,
            [AppRouteFields.ROUTE_FORM_MODE]: null,
        })
    ),
    on(
        AppRoutesActions.loadRoutesSuccess,
        (state, { routes }): AppRoutesState => ({
            ...state,
            [AppRouteFields.ROUTES]: routes,
        })
    ),
    on(
        AppRoutesActions.initEditRoute,
        (state): AppRoutesState => ({
            ...state,
            [AppRouteFields.SHOW_ROUTE_FORM]: true,
            [AppRouteFields.ROUTE_FORM_MODE]: 'EDIT',
        })
    ),
    on(
        AppRoutesActions.updateRouteSuccess,
        (state, { route }): AppRoutesState => ({
            ...state,
            [AppRouteFields.SHOW_ROUTE_FORM]: false,
            [AppRouteFields.ROUTE_FORM_MODE]: null,
            [AppRouteFields.ROUTES]: state[AppRouteFields.ROUTES].map((item: Route) =>
                item.id === route.id ? route : item
            ),
        })
    ),

    on(
        AppRoutesActions.changePagination,
        (state, { currentPage, pageSize }): AppRoutesState => ({
            ...state,
            [AppRouteFields.CURRENT_PAGE]: currentPage,
            [AppRouteFields.PAGE_SIZE]: pageSize,
        })
    )
);
