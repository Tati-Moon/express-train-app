import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';

import { selectCarriagesInfo, selectUniqueCarriagesInTrain } from '../../../redux/selectors/app-trip.selector';
import { CarriageViewComponent } from '../../../shared/components';
import { V2CarriagesInfo, V2UniqueCarriagesInTrain } from '../../models/v2-trip-carriage.model';
import { GetAvailableSeatsPipe } from '../../pipes/get-available-seats.pipe';
import { GetCarriagePipe } from '../../pipes/get-carriage.pipe';
import { GetCarriagePricePipe } from '../../pipes/get-carriage-price.pipe';

@Component({
    selector: 'app-trip-seat-choice',
    standalone: true,
    imports: [
        TabViewModule,
        BadgeModule,
        AvatarModule,
        CarriageViewComponent,
        TranslateModule,
        ButtonModule,
        CommonModule,
        GetCarriagePipe,
        GetCarriagePricePipe,
        GetAvailableSeatsPipe,
    ],
    templateUrl: './trip-seat-choice.component.html',
    styleUrl: './trip-seat-choice.component.scss',
})
export class TripSeatChoiceComponent {
    private store = inject(Store);
    public uniqueCarriagesInTrain!: Signal<V2UniqueCarriagesInTrain | null>;
    public carriagesInfo!: Signal<V2CarriagesInfo[] | null>;

    constructor() {
        const uniqueCarriagesInTrain$ = this.store.select(selectUniqueCarriagesInTrain);
        this.uniqueCarriagesInTrain = toSignal(uniqueCarriagesInTrain$, { initialValue: null });

        const carriagesInfo$ = this.store.select(selectCarriagesInfo);
        this.carriagesInfo = toSignal(carriagesInfo$, { initialValue: null });
    }
}
