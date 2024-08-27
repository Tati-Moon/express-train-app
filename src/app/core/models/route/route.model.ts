import { Station } from '../station/station.model';

export interface Route {
    id: number;
    path: number[];
    stations: Station[];
    carriages: string[];
    cities: string[];
}
