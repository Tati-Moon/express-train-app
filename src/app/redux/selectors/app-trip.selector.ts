import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Carriage } from '../../core/models';
import { Station } from '../../core/models/station/station.model';
import { SeatBooking, Trip, TripInfo } from '../../home/models';
import { CarriagesInTrain, TripCarriagesInfo } from '../../home/models/trip-carriage.model';
import { TripSchedule } from '../../home/models/trip-schedule.model';
import { AppTripState } from '../models/app-trip-state.model';
import { AppTripFields, StateFields } from '../models/state-fields';
import { selectCarriages } from './app-carriages.selector';
import { selectStations } from './app-stations.selector';

export const selectAppTrip = createFeatureSelector<AppTripState>(StateFields.APP_TRIP);

export const selectTrip = createSelector(selectAppTrip, (state: AppTripState) => state[AppTripFields.TRIP]);

export const selectTripInfo = createSelector(selectTrip, selectStations, (trip: Trip | null, stations: Station[]) => {
    if (stations.length !== 0) {
        if (trip) {
            const tripInfo: TripInfo = {
                date: trip.schedule.segments[0].time[0],
                from: stations[trip.path[0]].city,
                to: stations[trip.path[trip.path.length - 1]].city,
                rideId: trip.rideId,
            };
            return tripInfo;
        }
    }
    return null;
});

export const selectTripSchedule = createSelector(
    selectTrip,
    selectStations,
    (trip: Trip | null, stations: Station[]) => {
        if (stations.length !== 0) {
            if (trip) {
                const tripSchedule: TripSchedule = {
                    rideId: trip.rideId,
                    stationTripInfo: trip.path.map((station: number, index: number) => {
                        const timeTo = trip.schedule.segments[index - 1]?.time[1] ?? '';
                        const timeFrom = trip.schedule.segments[index]?.time[0] ?? '';
                        const diff: number = Math.abs(new Date(timeTo).getTime() - new Date(timeFrom).getTime());
                        const time = Math.floor(diff / (1000 * 60));

                        if (index === 0) {
                            return {
                                city: stations[station]?.city ?? '',
                                timeFrom,
                                timeTo: '',
                                timeStop: 'first station',
                            };
                        }

                        return {
                            city: stations[station]?.city ?? '',
                            timeFrom,
                            timeTo,
                            timeStop: Number.isNaN(time) ? 'last station' : `${time}m`,
                        };
                    }),
                };
                return tripSchedule;
            }
        }
        return null;
    }
);

export const selectTripCarriages = createSelector(
    selectTrip,
    selectCarriages,
    (trip: Trip | null, carriages: Carriage[]) => {
        if (carriages.length !== 0) {
            if (trip) {
                const carriagesInTrain: CarriagesInTrain = {};
                const seatsInTrain: number[] = [];

                trip.carriages.forEach((carriage: string, index: number) => {
                    const carriageInArray = carriages.find((car: Carriage) => carriage === car.code);
                    const rows = carriageInArray?.rows ?? 0;
                    const leftSeats = carriageInArray?.leftSeats ?? 0;
                    const rightSeats = carriageInArray?.rightSeats ?? 0;

                    const countSeats = (leftSeats + rightSeats) * rows;

                    seatsInTrain.push(countSeats);

                    if (!carriagesInTrain[carriage]) {
                        carriagesInTrain[carriage] = {
                            count: 1,
                            indexCar: [index],
                            rows,
                            leftSeats,
                            rightSeats,
                        };
                    } else {
                        carriagesInTrain[carriage].count += 1;
                        carriagesInTrain[carriage].indexCar.push(index);
                    }
                });
                const tripCarriagesInfo: TripCarriagesInfo = { carriagesInTrain, seatsInTrain };
                return tripCarriagesInfo;
            }
        }
        return null;
    }
);

export const selectFromTo = createSelector(selectAppTrip, (state: AppTripState) => {
    return { from: state[AppTripFields.FROM], to: state[AppTripFields.TO] };
});

export const selectBusySeats = createSelector(
    selectTrip,
    selectFromTo,
    (trip: Trip | null, fromTo: { from: number | null; to: number | null }) => {
        if (fromTo.from && fromTo.to) {
            if (trip) {
                const occupiedSeats: number[] = [];
                let occupiedSeatsStartAdded: boolean = false;
                let occupiedSeatsEndAdded: boolean = false;

                trip.path.forEach((station: number, index: number) => {
                    if (station === fromTo.from) {
                        occupiedSeatsStartAdded = true;
                    }

                    if (station === fromTo.to) {
                        occupiedSeatsEndAdded = true;
                    }

                    const busySeats = trip.schedule.segments[index]?.occupiedSeats;
                    if (occupiedSeatsStartAdded) {
                        if (!occupiedSeatsEndAdded) {
                            busySeats.forEach((seat: number) => {
                                occupiedSeats.push(seat);
                            });
                        }
                    }
                });
                return [...new Set(occupiedSeats)];
            }
        }
        return [];
    }
);

export const selectSelectedSeat = createSelector(selectAppTrip, (state: AppTripState) => {
    if (state[AppTripFields.SELECTED_SEAT_IN_TRAIN]) {
        const seatBooking: SeatBooking = {
            seatInTrain: state[AppTripFields.SELECTED_SEAT_IN_TRAIN],
            seatInCarriage: state[AppTripFields.SELECTED_SEAT_IN_CARRIAGE],
            numberOfCarriage: state[AppTripFields.NUMBER_OF_CARRIAGE],
        };
        return seatBooking;
    }
    return null;
});
