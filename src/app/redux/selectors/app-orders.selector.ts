import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Carriage } from '../../core/models';
import { Order, OrderStatus } from '../../core/models/orders/orders.model';
import { Segment } from '../../core/models/schedules/schedule.model';
import { User } from '../../core/models/user/user.model';
import { AppOrdersState } from '../models/app-orders-state.model';
import { AppOrdersFields, StateFields } from '../models/state-fields';
import { selectAllUsers } from './app-all-users.selector';
import { selectCarriages } from './app-carriages.selector';

export const selectAppOrders = createFeatureSelector<AppOrdersState>(StateFields.APP_ORDERS);

export const selectOrders = createSelector(selectAppOrders, (state: AppOrdersState) => state[AppOrdersFields.ORDERS]);

const getSeatDetails = (
    carriages: string[],
    seatId: number,
    carriageData: { code: string; rows: number; leftSeats: number; rightSeats: number }[]
): { carriageType: string | null; seatInCarriage: number | null; carriageNumber: number | null } => {
    let currentSeatIndex = 0;
    let carriageNumber = 0;

    const result = carriages.reduce<{
        carriageType: string | null;
        seatInCarriage: number | null;
        carriageNumber: number | null;
    }>(
        (acc, carriageCode) => {
            if (acc.carriageType !== null) return acc;

            carriageNumber += 1;

            const carriageInfo = carriageData.find((carriage) => carriage.code === carriageCode);
            if (!carriageInfo) return acc;

            const totalSeatsInCarriage = (carriageInfo.leftSeats + carriageInfo.rightSeats) * carriageInfo.rows;

            if (seatId > currentSeatIndex && seatId <= currentSeatIndex + totalSeatsInCarriage) {
                return {
                    carriageType: carriageCode,
                    seatInCarriage: seatId - currentSeatIndex,
                    carriageNumber,
                };
            }

            currentSeatIndex += totalSeatsInCarriage;
            return acc;
        },
        { carriageType: null, seatInCarriage: null, carriageNumber: null }
    );

    return result;
};

const getTotalPrice = (
    startIndex: number | null,
    endIndex: number | null,
    carriageType: string | null,
    carriages: string[],
    carriageData: Carriage[],
    segments: Segment[]
): number => {
    if (startIndex === null || endIndex === null || carriageType === null) {
        return 0;
    }
    if (startIndex < 0 || endIndex >= segments.length || startIndex > endIndex) {
        return 0;
    }

    let totalPrice = 0;

    for (let i = startIndex; i < endIndex; i += 1) {
        const segment = segments[i % segments.length];

        const pricePerCarriage = segment.price[carriageType] ?? 0;

        totalPrice += pricePerCarriage;
    }

    return totalPrice;
};

function convertOrder(order: Order, carriageData: Carriage[], allUsers: User[]) {
    function getStationIndices(
        path: number[],
        stationStart: number,
        stationEnd: number
    ): { startIndex: number | null; endIndex: number | null } {
        return {
            startIndex: path.indexOf(stationStart) ?? null,
            endIndex: path.indexOf(stationEnd) ?? null,
        };
    }

    const { startIndex, endIndex } = getStationIndices(order.path, order.stationStart, order.stationEnd);

    const startTime = startIndex !== null ? order.schedule.segments[startIndex]?.time[0] : null;
    const endTime = endIndex !== null ? order.schedule.segments[endIndex - 1]?.time[1] : null;

    let tripDuration: string | null = null;
    if (startTime && endTime) {
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        const durationMs = end - start;

        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

        tripDuration = `${hours}h ${minutes}m`;
    }

    const { carriageType, seatInCarriage, carriageNumber } = getSeatDetails(
        order.carriages,
        order.seatId,
        carriageData
    );
    const totalPrice = getTotalPrice(
        startIndex,
        endIndex,
        carriageType,
        order.carriages,
        carriageData,
        order.schedule.segments
    );

    const user = allUsers.find((userObj) => userObj.id === order.userId) || null;

    const convertedRide = {
        id: order.id,
        userId: order.id,
        routeId: order.routeId,
        rideId: order.rideId,
        seatId: order.seatId,
        stationStart: order.stationStart,
        stationEnd: order.stationEnd,
        status: order.status,
        carriageType,
        carriageNumber,
        seatInCarriage,
        totalPrice,
        user,
        startIndex,
        endIndex,
        startTime,
        endTime,
        tripDuration,
    };

    return convertedRide;
}

export const selectMappedOrders = createSelector(
    selectOrders,
    selectCarriages,
    selectAllUsers,
    (orders: Order[], carriages: Carriage[], allUsers: User[]) =>
        orders
            .map((order) => convertOrder(order, carriages, allUsers))
            .sort((a, b) => {
                if (!a.startTime || !b.startTime) return 0;
                return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
            })
);

export const selectActiveOrders = createSelector(selectOrders, (orders: Order[]) =>
    orders.filter((order) => order.status === OrderStatus.ACTIVE)
);
