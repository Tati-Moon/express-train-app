import { TripSchedule } from '../../../home/models/trip-schedule.model';

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

export interface RideDetails {
    date: string;
    routeId: number;
    rideId: number;
    cityStart: CityInfo;
    cityEnd: CityInfo;
    cityFrom: CityInfo;
    cityTo: CityInfo;
    carriages: CarriageModel[];
    occupiedSeats: number[];
    travelTime: string;
    trainInformation: string;
    tripSchedule: TripSchedule;
}

export interface CityInfo {
    id: number;
    name: string;
    dateTime: string;
}

export interface TravelInfo {
    travelTime?: string;
    icon?: string;
}

export interface CarriageModel {
    id: string;
    name: string;
    price: number;
    countSeats: number;
    availableSeats: number;
}
