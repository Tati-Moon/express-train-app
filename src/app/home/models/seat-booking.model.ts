export interface SeatBooking {
    seatInTrain: number | null;
    seatInCarriage: number | null;
    numberOfCarriage: number | null;
    price: number;
}

export interface SeatForBook {
    rideId: number;
    seat: number;
    stationStart: number;
    stationEnd: number;
}
