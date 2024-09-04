import { Carriage } from '../carriages/carriage.model';

export interface ScheduleRide {
    id: number;
    path: number[];
    stations: Station[];
    carriages: string[];
    schedule: Schedule[];
    carriages_list: Carriage[];
    stations_list: Station[];
}

export interface Schedule {
    rideId: number;
    segments: Segment[];
}

export interface Segment {
    time: [string, string];
    price: Record<string, number>;
}

export interface Station {
    id: number;
    city: string;
}
