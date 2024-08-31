import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { AppAdminState } from '../models/app-admin-state.model';
import { AppAllUsersState } from '../models/app-all-users-state.model';
import { AppCarriagesState } from '../models/app-carriages-state.model';
import { AppConfigState } from '../models/app-config-state.model';
import { AppLanguageState } from '../models/app-language-state.model';
import { AppOrdersState } from '../models/app-orders-state.model';
import { AppRoutesState } from '../models/app-routes-state.model';
import { AppSchedulesState } from '../models/app-schedule-state.model';
import { AppStationsState } from '../models/app-stations-state';
import { AppThemeState } from '../models/app-theme-state.model';
import { AppTripState } from '../models/app-trip-state.model';
import { AppUserState } from '../models/app-user-state.model';
import { StateFields } from '../models/state-fields';
import { appAdminReducer } from './app-admin.reducer';
import { appAllUsersReducer } from './app-all-users.reducer';
import { appCarriagesReducer } from './app-carriages.reducer';
import { appConfigReducer } from './app-config.reducer';
import { appLanguageReducer } from './app-language.reducer';
import { appOrdersReducer } from './app-orders.reducer';
import { appRoutesReducer } from './app-routes.reducer';
import { appSchedulesReducer } from './app-schedules.reducer';
import { appStationsReducer } from './app-stations.reducer';
import { appThemeReducer } from './app-theme.reducer';
import { appTripReducer } from './app-trip.reducer';
import { appUserReducer } from './app-user.reducer';

export interface State {
    [StateFields.APP_CONFIG_GENERAL]: AppConfigState;
    [StateFields.APP_CONFIG_LANGUAGE]: AppLanguageState;
    [StateFields.APP_CONFIG_THEME]: AppThemeState;
    [StateFields.APP_CONFIG_ADMIN]: AppAdminState;
    [StateFields.APP_CARRIAGES]: AppCarriagesState;
    [StateFields.APP_SCHEDULES]: AppSchedulesState;
    [StateFields.APP_USER]: AppUserState;
    [StateFields.APP_STATIONS]: AppStationsState;
    [StateFields.APP_ROUTES]: AppRoutesState;
    [StateFields.APP_TRIP]: AppTripState;
    [StateFields.APP_ORDERS]: AppOrdersState;
    [StateFields.APP_ALL_USERS]: AppAllUsersState;
}

export const reducers: ActionReducerMap<State> = {
    [StateFields.APP_CONFIG_GENERAL]: appConfigReducer,
    [StateFields.APP_CONFIG_LANGUAGE]: appLanguageReducer,
    [StateFields.APP_CONFIG_THEME]: appThemeReducer,
    [StateFields.APP_CONFIG_ADMIN]: appAdminReducer,
    [StateFields.APP_CARRIAGES]: appCarriagesReducer,
    [StateFields.APP_SCHEDULES]: appSchedulesReducer,
    [StateFields.APP_USER]: appUserReducer,
    [StateFields.APP_STATIONS]: appStationsReducer,
    [StateFields.APP_ROUTES]: appRoutesReducer,
    [StateFields.APP_TRIP]: appTripReducer,
    [StateFields.APP_ORDERS]: appOrdersReducer,
    [StateFields.APP_ALL_USERS]: appAllUsersReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
