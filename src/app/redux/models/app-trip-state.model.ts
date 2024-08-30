import { Trip } from '../../home/models';
import { AppTripFields } from './state-fields';

export interface AppTripState {
    [AppTripFields.TRIP]: Trip | null;
    [AppTripFields.FROM]: number | null;
    [AppTripFields.TO]: number | null;
    [AppTripFields.SELECTED_SEAT_IN_TRAIN]: number | null;
    [AppTripFields.SELECTED_SEAT_IN_CARRIAGE]: number | null;
    [AppTripFields.NUMBER_OF_CARRIAGE]: number | null;
    [AppTripFields.PRICE]: number;
}
