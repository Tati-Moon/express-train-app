import { Schedule } from './schedule.model';

export interface Trip {
    carriages: string[];
    path: number[];
    rideId: number;
    schedule: Schedule;
}
