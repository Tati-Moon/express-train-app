import { Carriage } from '../../core/models';

export interface TripCarriage {
    count: number;
    indexCar: number[];
    countSeats: number;
    carriage: Carriage;
    startIndexSeats: number[];
}

export interface CarriagesInTrain {
    [key: string]: TripCarriage;
}
