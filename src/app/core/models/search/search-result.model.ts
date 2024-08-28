export interface SearchResult {
    from: City;
    to: City;
    routes: Route[];
}

export interface City {
    stationId: number;
    city: string;
    geolocation: GeoLocation;
}

export interface GeoLocation {
    latitude: number;
    longitude: number;
}

export interface Route {
    id: number;
    path: number[];
    carriages: string[];
    schedule: ScheduleItem[];
}

export interface ScheduleItem {
    rideId: number;
    segments: Segment[];
}

export interface Segment {
    time: string[];
    price: Price;
    occupiedSeats: number[];
}

export interface Price {
    [carriageType: string]: number;
}
