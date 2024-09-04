import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Carriage } from '../../core/models';
import { Station } from '../../core/models/station/station.model';
import { SeatBooking, Trip, TripInfo } from '../../home/models';
import { TripSchedule } from '../../home/models/trip-schedule.model';
import { V2CarriagesInfo, V2UniqueCarriagesInTrain } from '../../home/models/v2-trip-carriage.model';
import { AppTripState } from '../models/app-trip-state.model';
import { AppTripFields, StateFields } from '../models/state-fields';
import { selectCarriages } from './app-carriages.selector';
import { selectStations } from './app-stations.selector';

export const selectAppTrip = createFeatureSelector<AppTripState>(StateFields.APP_TRIP);

export const selectTrip = createSelector(selectAppTrip, (state: AppTripState) => state[AppTripFields.TRIP]);

export const selectFromTo = createSelector(selectAppTrip, (state: AppTripState) => {
    return { from: state[AppTripFields.FROM], to: state[AppTripFields.TO] };
});

export const selectTripInfo = createSelector(
    selectTrip,
    selectStations,
    selectFromTo,
    (trip: Trip | null, stations: Station[], fromTo: { from: number | null; to: number | null }) => {
        if (stations.length !== 0) {
            if (trip && fromTo.from && fromTo.to) {
                const indexDeparture = trip.path.indexOf(fromTo.from);
                const indexArrival = trip.path.indexOf(fromTo.to);

                if (indexArrival === -1 || indexDeparture === -1) {
                    return Error('Trip not found');
                }
                const from = stations.find((station: Station) => station.id === fromTo.from)?.city ?? '';
                const to = stations.find((station: Station) => station.id === fromTo.to)?.city ?? '';
                const tripInfo: TripInfo = {
                    departureTime: trip.schedule.segments[indexDeparture]?.time[0] ?? '',
                    arrivalTime: trip.schedule.segments[indexArrival - 1]?.time[1] ?? '',
                    from,
                    to,
                    rideId: trip.rideId,
                };
                return tripInfo;
            }
        }
        return null;
    }
);

export const selectTripSchedule = createSelector(
    selectTrip,
    selectStations,
    selectFromTo,
    (trip: Trip | null, stations: Station[], fromTo: { from: number | null; to: number | null }) => {
        if (stations.length !== 0) {
            if (trip && fromTo.from && fromTo.to) {
                const tripSchedule: TripSchedule = {
                    routeId: trip.routeId,
                    stationTripInfo: trip.path.map((station: number, index: number) => {
                        const timeTo = trip.schedule.segments[index - 1]?.time[1] ?? '';
                        const timeFrom = trip.schedule.segments[index]?.time[0] ?? '';
                        const diff: number = Math.abs(new Date(timeTo).getTime() - new Date(timeFrom).getTime());
                        const time = Math.floor(diff / (1000 * 60)) ?? NaN;
                        const city = stations.find((s) => s.id === station)?.city ?? '';

                        if (index === 0) {
                            return {
                                city,
                                timeFrom,
                                timeTo: '',
                                timeStop: 'TRIP.FIRST_STATION',
                                cityFrom: station === fromTo.from,
                                cityTo: station === fromTo.to,
                            };
                        }

                        return {
                            city,
                            timeFrom,
                            timeTo,
                            timeStop: Number.isNaN(time) ? 'TRIP.LAST_STATION' : `${time}m`,
                            cityFrom: station === fromTo.from,
                            cityTo: station === fromTo.to,
                        };
                    }),
                };
                return tripSchedule;
            }
        }
        return null;
    }
);

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
                            if (busySeats !== undefined) {
                                busySeats.forEach((seat: number) => {
                                    occupiedSeats.push(seat);
                                });
                            }
                        }
                    }
                });
                return [...new Set(occupiedSeats)];
            }
        }
        return [];
    }
);

export const selectPrice = createSelector(
    selectTrip,
    selectFromTo,
    (trip: Trip | null, fromTo: { from: number | null; to: number | null }) => {
        if (fromTo.from && fromTo.to) {
            if (trip) {
                const carriagesPrice: { [key: string]: number } = {};
                let carriagesPriceStartAdded: boolean = false;
                let carriagesPriceEndAdded: boolean = false;

                trip.path.forEach((station: number, index: number) => {
                    if (station === fromTo.from) {
                        carriagesPriceStartAdded = true;
                    }

                    if (station === fromTo.to) {
                        carriagesPriceEndAdded = true;
                    }

                    const busySeats = trip.schedule.segments[index]?.price;
                    if (carriagesPriceStartAdded) {
                        if (!carriagesPriceEndAdded) {
                            if (busySeats !== undefined) {
                                Object.keys(busySeats).forEach((seat: string) => {
                                    if (carriagesPrice[seat]) {
                                        carriagesPrice[seat] += busySeats[seat];
                                    } else {
                                        carriagesPrice[seat] = busySeats[seat];
                                    }
                                });
                            }
                        }
                    }
                });
                return carriagesPrice;
            }
        }
        return {};
    }
);

export const selectSelectedSeat = createSelector(selectAppTrip, (state: AppTripState) => {
    if (state[AppTripFields.SELECTED_SEAT_IN_TRAIN]) {
        const seatBooking: SeatBooking = {
            seatInTrain: state[AppTripFields.SELECTED_SEAT_IN_TRAIN],
            seatInCarriage: state[AppTripFields.SELECTED_SEAT_IN_CARRIAGE],
            numberOfCarriage: state[AppTripFields.NUMBER_OF_CARRIAGE],
            price: state[AppTripFields.PRICE],
        };
        return seatBooking;
    }
    return null;
});

export const selectUniqueCarriagesInTrain = createSelector(selectTrip, (trip: Trip | null) => {
    const uniqueCarriages: V2UniqueCarriagesInTrain = {
        carriages: [...new Set(trip?.carriages)].sort(),
    };
    if (uniqueCarriages.carriages.length !== 0) return uniqueCarriages;
    return null;
});

export const selectCarriagesInfo = createSelector(
    selectTrip,
    selectCarriages,
    selectBusySeats,
    selectPrice,
    (trip: Trip | null, carriages: Carriage[], busySeats: number[], price: { [key: string]: number }) => {
        if (trip && carriages.length !== 0 && price) {
            const carriagesInfo: V2CarriagesInfo[] = [];
            let startIndexSeats: number = 0;

            trip.carriages.forEach((carriage: string, index: number) => {
                const carriageInStore = carriages.find((car: Carriage) => carriage === car.code);
                const rows = carriageInStore?.rows ?? 0;
                const leftSeats = carriageInStore?.leftSeats ?? 0;
                const rightSeats = carriageInStore?.rightSeats ?? 0;

                const countSeats = (leftSeats + rightSeats) * rows;

                const busySeatsInCarriage = busySeats.filter(
                    (seat: number) => seat > startIndexSeats && seat <= startIndexSeats + countSeats
                );

                carriagesInfo.push({
                    type: carriage,
                    indexCarriage: index,
                    countSeats,
                    startIndexSeats,
                    busySeats: busySeatsInCarriage,
                    availableSeats: countSeats - busySeatsInCarriage.length,
                    carriage: {
                        code: carriage,
                        name: carriage,
                        leftSeats,
                        rightSeats,
                        rows,
                    },
                    price: price[carriage] ?? 0,
                });
                startIndexSeats += countSeats;
            });
            return carriagesInfo;
        }
        return null;
    }
);
