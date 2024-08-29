export interface SeatBooking {
    seatInTrain: number | null;
    seatInCarriage: number | null;
    numberOfCarriage: number | null;
}

export interface SeatForBook {
    rideId: number;
    seat: number;
    stationStart: number;
    stationEnd: number;
}
