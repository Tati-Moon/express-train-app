import { createReducer, on } from '@ngrx/store';

import { AppTripActions } from '../actions/app-trip.actions';
import { AppTripState } from '../models/app-trip-state.model';
import { AppTripFields } from '../models/state-fields';

export const initialState: AppTripState = {
    [AppTripFields.TRIP]: null,
    [AppTripFields.FROM]: null,
    [AppTripFields.TO]: null,
    [AppTripFields.SELECTED_SEAT_IN_TRAIN]: null,
    [AppTripFields.SELECTED_SEAT_IN_CARRIAGE]: null,
    [AppTripFields.NUMBER_OF_CARRIAGE]: null,
    [AppTripFields.PRICE]: 0,
};

export const appTripReducer = createReducer(
    initialState,
    on(
        AppTripActions.loadTripInfoSuccess,
        (state, { trip, from, to }): AppTripState => ({
            ...state,
            [AppTripFields.TRIP]: trip,
            [AppTripFields.FROM]: from,
            [AppTripFields.TO]: to,
            [AppTripFields.SELECTED_SEAT_IN_TRAIN]: null,
            [AppTripFields.NUMBER_OF_CARRIAGE]: null,
            [AppTripFields.SELECTED_SEAT_IN_CARRIAGE]: null,
        })
    ),
    on(
        AppTripActions.clearTrip,
        (state): AppTripState => ({
            ...state,
            [AppTripFields.TRIP]: null,
        })
    ),
    on(
        AppTripActions.selectSeat,
        (state, { seatInCarriage, numberOfCarriage, seatInTrain, price }): AppTripState => ({
            ...state,
            [AppTripFields.SELECTED_SEAT_IN_TRAIN]: seatInTrain,
            [AppTripFields.NUMBER_OF_CARRIAGE]: numberOfCarriage,
            [AppTripFields.SELECTED_SEAT_IN_CARRIAGE]: seatInCarriage,
            [AppTripFields.PRICE]: price,
        })
    ),
    on(
        AppTripActions.clearSelectedSeat,
        (state): AppTripState => ({
            ...state,
            [AppTripFields.SELECTED_SEAT_IN_TRAIN]: null,
            [AppTripFields.NUMBER_OF_CARRIAGE]: null,
            [AppTripFields.SELECTED_SEAT_IN_CARRIAGE]: null,
            [AppTripFields.PRICE]: 0,
        })
    )
);
