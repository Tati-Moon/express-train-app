export interface Station {
    id: number;
    city: string;
    latitude: number;
    longitude: number;
    connectedTo: Connected[];
    cities: string[];
    relations: number[];
}

export interface Connected {
    id: number;
    distance: number;
    city: string;
    latitude: number;
    longitude: number;
}
