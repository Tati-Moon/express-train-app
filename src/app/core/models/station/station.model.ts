export interface Station {
    id: number;
    city: string;
    latitude: number;
    longitude: number;
    connectedTo: Connected[];
}

export interface Connected {
    id: number;
    distance: number;
    city: string;
    latitude: number;
    longitude: number;
}
