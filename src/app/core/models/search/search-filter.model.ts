export interface SearchFilter {
    fromLatitude: number;
    fromLongitude: number;
    toLatitude: number;
    toLongitude: number;
    date?: string | null;
    fromCity?: string;
    toCity?: string;
}
