import { Segment } from '../schedules/schedule.model';
import { User } from '../user/user.model';

export enum OrderStatus {
    ACTIVE = 'active',
    COMPLETED = 'completed',
    REJECTED = 'rejected',
    CANCELED = 'canceled',
}

export interface Order {
    id: number;
    userId: number;
    routeId: number;
    rideId: number;
    seatId: number;
    path: number[];
    carriages: string[];
    stationStart: number;
    stationEnd: number;
    schedule: { segments: Segment[] };
    status: OrderStatus;
}

export interface ConvertedOrder {
    id: number;
    userId: number;
    routeId: number;
    rideId: number;
    seatId: number;
    stationStart: number;
    stationEnd: number;
    status: OrderStatus;
    carriageType: string | null;
    carriageNumber: number | null;
    seatInCarriage: number | null;
    totalPrice: number;
    user: User | null;
    startIndex: number | null;
    endIndex: number | null;
    startTime: string | null;
    endTime: string | null;
    tripDuration: string | null;
}
