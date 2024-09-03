import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SearchFilter } from '../../core/models/search/search-filter.model';
import {
    Carriage,
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
            // const dateObject = new Date(filter.date);
            // console.log('dateObject', dateObject);
            // const unixTimestamp = Math.floor(dateObject.getTime() / 1000);
            params = params.set('time', filter.date);
        }
        console.log('filter', filter);
        console.log('params', params);

        return this.http.get<SearchResult>({ url: environment.apiUrlSearch, params }).pipe(
            map((response: SearchResult) => {
                console.log('response', response);
                return response;
            })
        );
    }

    public mapToRideDetails(routesData: Route[], cityFromId: number, cityToId: number): RideDetails[] {
        const allRideDetails: RideDetails[] = [];

        routesData.forEach((routeData) => {
            const cityFromIndex = routeData.path.indexOf(cityFromId);
            const cityToIndex = routeData.path.indexOf(cityToId);

            if (cityFromIndex === -1 || cityToIndex === -1 || cityFromIndex >= cityToIndex) {
                return;
            }

            const cityStartId = routeData.path[0];
            const cityEndId = routeData.path[routeData.path.length - 1];

            routeData.schedule.forEach((scheduleItem) => {
                const { segments } = scheduleItem;
                const segmentRange = segments.slice(cityFromIndex, cityToIndex);
                if (segmentRange.length === 0) {
                    return;
                }
                const sumPrice = this.calculateSumPrice(segmentRange);
                const travelTime = this.dateTimeService.calculateTimeDifference(
                    segmentRange[0].time[1],
                    segmentRange[segmentRange.length - 1].time[0]
                );

                const trainInformation = this.getTrainInformation(cityStartId, cityEndId);
                const cityFromDateTime = segmentRange[0].time[1];
                const cityToDateTime = segmentRange[segmentRange.length - 1].time[0];

                allRideDetails.push({
                    date: segmentRange[0].time[1],
                    routeId: routeData.id,
                    rideId: scheduleItem.rideId,
                    cityStart: this.createCityDetail(cityStartId, ''),
                    cityEnd: this.createCityDetail(cityEndId, ''),
                    cityFrom: this.createCityDetail(cityFromId, cityFromDateTime),
                    cityTo: this.createCityDetail(cityToId, cityToDateTime),
                    carriages: this.convertPriceToCarriageArray(sumPrice),
                    occupiedSeats: segmentRange[segmentRange.length - 1].occupiedSeats,
                    travelTime,
                    trainInformation,
                    tripSchedule: this.getTripSchedule(scheduleItem, routeData.path, cityFromId, cityToId),
                });
            });
        });

        console.log('allRideDetails', allRideDetails);

        return allRideDetails;
    }

    private getTripSchedule(
        scheduleItem: ScheduleItem,
        path: number[],
        cityFromId: number,
        cityToId: number
    ): TripSchedule {
        const tripSchedule: TripSchedule = {
            rideId: scheduleItem.rideId,
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

    private convertPriceToCarriageArray(price: Price): Carriage[] {
        return Object.entries(price)
            .map(([carriageType, priceValue]) => {
                if (!carriageType) {
                    return null;
                }
                return {
                    id: carriageType,
                    name: carriageType,
                    price: priceValue,
                    seats: 0,
                };
            })
            .filter((carriage): carriage is Carriage => carriage !== null);
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
