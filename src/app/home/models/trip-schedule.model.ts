export interface TripSchedule {
    stationTripInfo: StationTripInfo[];
    routeId: number;
}

export interface StationTripInfo {
    city: string;
    timeFrom: string;
    timeTo: string;
    timeStop: string;
    cityFrom: boolean;
    cityTo: boolean;
}
