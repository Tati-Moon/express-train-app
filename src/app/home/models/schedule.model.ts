export interface Schedule {
    segments: Segments[];
}

export interface Segments {
    time: string[];
    price: Price;
    occupiedSeats: number[];
}

export interface Price {
    [key: string]: number;
}
