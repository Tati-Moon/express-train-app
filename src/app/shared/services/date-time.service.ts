import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DateTimeService {
    public calculateTimeDifference(startTime: string, endTime: string): string {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const differenceInMs = end.getTime() - start.getTime();

        const hours = Math.floor(differenceInMs / (1000 * 60 * 60));
        const minutes = Math.floor((differenceInMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m`;
    }
}
