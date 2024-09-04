import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Carriage } from '../../core/models/carriages/carriage.model';
import { SearchFilter } from '../../core/models/search/search-filter.model';
import {
    CarriageModel,
    Price,
    RideDetails,
    Route,
    ScheduleItem,
    SearchResult,
    Segment,
} from '../../core/models/search/search-result.model';
import { HttpService } from '../../core/services/http.service';
import { DateTimeService } from '../../shared/services/date-time.service';
import { StationService } from '../../shared/services/station.service';
import { TripSchedule } from '../models/trip-schedule.model';

@Injectable({
    providedIn: 'root',
})
export class SearchService {
    constructor(
        private http: HttpService,
        private stationService: StationService,
        private dateTimeService: DateTimeService
    ) {}

    public search(filter: SearchFilter): Observable<SearchResult> {
        let params = new HttpParams()
            .set('fromLatitude', filter.fromLatitude.toString())
            .set('fromLongitude', filter.fromLongitude.toString())
            .set('toLatitude', filter.toLatitude.toString())
            .set('toLongitude', filter.toLongitude.toString());

        if (filter.date) {
            const dateObject = new Date(filter.date);
            const unixTimestamp = Math.floor(dateObject.getTime() / 1000);
            params = params.set('time', unixTimestamp);
        }

        return this.http.get<SearchResult>({ url: environment.apiUrlSearch, params }).pipe(
            map((response: SearchResult) => {
                return response;
            })
        );
    }

    public mapToRideDetails(
        routes: Route[],
        cityFromId: number,
        cityToId: number,
        allCarriages: Carriage[]
    ): RideDetails[] {
        const allRideDetails: RideDetails[] = [];

        routes.forEach((routeItem) => {
            const cityFromIndex = routeItem.path.indexOf(cityFromId);
            const cityToIndex = routeItem.path.indexOf(cityToId);

            if (cityFromIndex === -1 || cityToIndex === -1 || cityFromIndex >= cityToIndex) {
                return;
            }

            const cityStartId = routeItem.path[0];
            const cityEndId = routeItem.path[routeItem.path.length - 1];

            routeItem.schedule.forEach((scheduleItem) => {
                const { segments } = scheduleItem;
                const segmentRange = segments.slice(cityFromIndex, cityToIndex);
                if (segmentRange.length === 0) {
                    return;
                }
                const sumPrice = this.calculateSumPrice(segmentRange);
                const travelTime = this.dateTimeService.calculateTimeDifference(
                    segmentRange[0].time[0],
                    segmentRange[segmentRange.length - 1].time[1]
                );

                const trainInformation = this.getTrainInformation(cityStartId, cityEndId);
                const cityFromDateTime = segmentRange[0].time[0];
                const cityToDateTime = segmentRange[segmentRange.length - 1].time[1];

                allRideDetails.push({
                    date: segmentRange[0].time[0],
                    routeId: routeItem.id,
                    rideId: scheduleItem.rideId,
                    cityStart: this.createCityDetail(cityStartId, ''),
                    cityEnd: this.createCityDetail(cityEndId, ''),
                    cityFrom: this.createCityDetail(cityFromId, cityFromDateTime),
                    cityTo: this.createCityDetail(cityToId, cityToDateTime),
                    carriages: this.convertPriceToCarriageArray(
                        scheduleItem,
                        routeItem.path,
                        cityFromId,
                        cityToId,
                        sumPrice,
                        allCarriages,
                        routeItem.carriages
                    ),
                    occupiedSeats: [],
                    travelTime,
                    trainInformation,
                    tripSchedule: this.getTripSchedule(
                        routeItem.id,
                        scheduleItem,
                        routeItem.path,
                        cityFromId,
                        cityToId
                    ),
                });
            });
        });

        return allRideDetails;
    }

    private getTripSchedule(
        routeId: number,
        scheduleItem: ScheduleItem,
        path: number[],
        cityFromId: number,
        cityToId: number
    ): TripSchedule {
        const tripSchedule: TripSchedule = {
            routeId,
            stationTripInfo: path.map((station: number, index: number) => {
                const timeTo = scheduleItem.segments[index - 1]?.time[1] ?? '';
                const timeFrom = scheduleItem.segments[index]?.time[0] ?? '';
                const diff: number = Math.abs(new Date(timeTo).getTime() - new Date(timeFrom).getTime());
                const time = Math.floor(diff / (1000 * 60)) ?? NaN;
                const city = this.getCityName(station) ?? '';

                if (index === 0) {
                    return {
                        city,
                        timeFrom,
                        timeTo: '',
                        timeStop: 'TRIP.FIRST_STATION',
                        cityFrom: station === cityFromId,
                        cityTo: station === cityToId,
                    };
                }

                return {
                    city,
                    timeFrom,
                    timeTo,
                    timeStop: Number.isNaN(time) ? 'TRIP.LAST_STATION' : `${time}m`,
                    cityFrom: station === cityFromId,
                    cityTo: station === cityToId,
                };
            }),
        };
        return tripSchedule;
    }

    private convertPriceToCarriageArray(
        scheduleItem: ScheduleItem,
        path: number[],
        cityFromId: number,
        cityToId: number,
        price: Price,
        allCarriages: Carriage[],
        carriages: string[]
    ): CarriageModel[] {
        const carriageModel = this.carriagesInfo(
            allCarriages,
            carriages,
            this.getBusySeats(scheduleItem, path, cityFromId, cityToId),
            price
        );

        const grouped: { [id: string]: CarriageModel } = {};

        carriageModel.forEach((carriage) => {
            if (!grouped[carriage.id]) {
                grouped[carriage.id] = { ...carriage };
            } else {
                grouped[carriage.id].countSeats += carriage.countSeats;
                grouped[carriage.id].availableSeats += carriage.availableSeats;
            }
        });

        return Object.values(grouped);
    }

    getBusySeats(scheduleItem: ScheduleItem, path: number[], cityFromId: number, cityToId: number) {
        if (scheduleItem) {
            const occupiedSeats: number[] = [];
            let occupiedSeatsStartAdded: boolean = false;
            let occupiedSeatsEndAdded: boolean = false;

            path.forEach((station: number, index: number) => {
                if (station === cityFromId) {
                    occupiedSeatsStartAdded = true;
                }

                if (station === cityToId) {
                    occupiedSeatsEndAdded = true;
                }

                const busySeats = scheduleItem.segments[index]?.occupiedSeats;
                if (occupiedSeatsStartAdded) {
                    if (!occupiedSeatsEndAdded) {
                        if (busySeats !== undefined) {
                            busySeats.forEach((seat: number) => {
                                occupiedSeats.push(seat);
                            });
                        }
                    }
                }
            });
            return [...new Set(occupiedSeats)];
        }
        return [];
    }

    private carriagesInfo(
        allCarriages: Carriage[],
        carriagesRide: string[],
        busySeats: number[],
        price: { [key: string]: number }
    ): CarriageModel[] {
        const carriagesInfo: CarriageModel[] = [];
        let startIndexSeats: number = 0;

        carriagesRide.forEach((carriage: string) => {
            const carriageInStore = allCarriages.find((car: Carriage) => carriage === car.code);
            const rows = carriageInStore?.rows ?? 0;
            const leftSeats = carriageInStore?.leftSeats ?? 0;
            const rightSeats = carriageInStore?.rightSeats ?? 0;
            const countSeats = (leftSeats + rightSeats) * rows;
            const busySeatsInCarriage = busySeats.filter(
                (seat: number) => seat > startIndexSeats && seat <= startIndexSeats + countSeats
            );

            carriagesInfo.push({
                id: carriage,
                name: carriage,
                countSeats,
                availableSeats: countSeats - busySeatsInCarriage.length,
                price: price[carriage] ?? 0,
            });
            startIndexSeats += countSeats;
        });

        return carriagesInfo;
    }

    createCityDetail = (cityId: number, dateTime: string) => ({
        id: cityId,
        name: this.getCityName(cityId) ?? '',
        dateTime,
    });

    private calculateSumPrice(segments: Segment[]): Price {
        return segments.reduce((acc, segment) => {
            Object.keys(segment.price).forEach((carriageType) => {
                acc[carriageType] = (acc[carriageType] || 0) + segment.price[carriageType];
            });
            return acc;
        }, {} as Price);
    }

    getTrainInformation(cityStartId: number, cityEndId: number): string {
        const cityStartName = this.getCityName(cityStartId);
        const cityEndName = this.getCityName(cityEndId);
        return `${cityStartName} → ${cityEndName}`;
    }

    getCityName(cityId: number) {
        let cityName;
        this.stationService.getStation(cityId).subscribe((cityStart) => {
            cityName = cityStart ? cityStart.city : 'Unknown';
        });
        return cityName;
    }
}
