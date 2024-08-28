export interface SearchFilter {
    fromLatitude: number;
    fromLongitude: number;
    toLatitude: number;
    toLongitude: number;
    time?: number | null;
    date?: string | null;
    fromCity?: string;
    toCity?: string;
}
