export interface TripCarriage {
    count: number;
    indexCar: number[];
    rows: number;
    leftSeats: number;
    rightSeats: number;
}

export interface CarriagesInTrain {
    [key: string]: TripCarriage;
}

export interface TripCarriagesInfo {
    carriagesInTrain: CarriagesInTrain | null;
    seatsInTrain: number[] | null;
}
