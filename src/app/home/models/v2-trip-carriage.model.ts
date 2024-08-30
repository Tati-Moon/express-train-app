import { Carriage } from '../../core/models';

export interface V2TripCarriage {
    carriages: V2CarriagesInfo[];
}

export interface V2CarriagesInfo {
    type: string;
    indexCarriage: number;
    countSeats: number;
    startIndexSeats: number;
    busySeats: number[];
    availableSeats: number;
    carriage: Carriage;
    price: number;
}

export interface V2UniqueCarriagesInTrain {
    carriages: string[];
}
