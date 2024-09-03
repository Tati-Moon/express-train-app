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

export interface FinalRoute {
    routeId: number;
    rides: RideDetails[];
}

export interface RideDetails {
    date: string;
    routeId: number;
    rideId: number;
    cityStart: CityInfo;
    cityEnd: CityInfo;
    cityFrom: CityInfo;
    cityTo: CityInfo;
    carriages: Carriage[];
    occupiedSeats: number[];
    travelTime: string;
    trainInformation: string;
}

export interface CityInfo {
    id: number;
    name: string;
    dateTime: string;
    date: string;
    time: string;
}

export interface TravelInfo {
    travelTime?: string;
    icon?: string;
}

export interface Carriage {
    id: string;
    name: string;
    price: number;
    seats: number;
}
