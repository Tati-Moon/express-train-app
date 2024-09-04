import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { TimelineModule } from 'primeng/timeline';

import { Routers } from '../../../core/models/enums/routers';
import { QueryParams } from '../../../core/models/query-params.model';
import { RideDetails, TravelInfo } from '../../../core/models/search/search-result.model';
import { AppDatePipe } from '../../../core/pipes/date.pipe';
import { TripSchedule } from '../../models/trip-schedule.model';
import { TripRoutePopupComponent } from '../trip-route-popup/trip-route-popup.component';

@Component({
    selector: 'app-search-result-item',
    standalone: true,
    imports: [
        CommonModule,
        TimelineModule,
        ButtonModule,
        ChipModule,
        DividerModule,
        TableModule,
        ButtonGroupModule,
        TranslateModule,
        AsyncPipe,
        RouterLink,
        TripRoutePopupComponent,
        AppDatePipe,
    ],
    templateUrl: './search-result-item.component.html',
    styleUrl: './search-result-item.component.scss',
})
export class SearchResultItemComponent implements OnInit {
    public store = inject(Store);
    @Input() public rideDetail!: RideDetails;
    events: TravelInfo[] = [];
    public travelTime!: string;
    public showRouteModal: boolean = false;

    constructor(private router: Router) {}

    getLink(rideId: number, cityFromId: number, cityToId: number) {
        const queryParams: QueryParams = {
            from: cityFromId,
            to: cityToId,
        };
        this.router.navigate([Routers.TRIP, rideId], { queryParams });
    }

    ngOnInit(): void {
        this.travelTime = this.rideDetail?.travelTime;
        this.setEvents();
    }

    setEvents() {
        this.events = [{ icon: 'pi pi-circle' }, { travelTime: this.travelTime }, { icon: 'pi pi-circle-fill' }];
    }

    public handleOpenModal(event: MouseEvent): void {
        event.stopPropagation();
        this.showRouteModal = true;
    }

    public handleCloseModal(): void {
        this.showRouteModal = false;
    }

    public tripSchedule(): TripSchedule | null {
        return null;
    }
}
