import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Observable, of } from 'rxjs';

import { Carriage } from '../../../core/models';
import { ScheduleRide, Segment, Station } from '../../../core/models/schedules/schedule.model';
import { AppSchedulesActions } from '../../../redux/actions/app-schedule.actions';
import { selectStationById } from '../../../redux/selectors/app-stations.selector';
import {
    CreatePriceFormFields,
    CreateRideFormFields,
    CreateSegmentsFormFields,
    RideTimeCreateForm,
    RideTimeCreateFormFields,
} from '../../models/ride-create-form.model';
import { ErrorMessageService } from '../../services/error-message.service';
import { SchedulesService } from '../../services/schedules.service';
import { RidePriceItemComponent } from '../ride-price-item/ride-price-item.component';
import { RideTimeItemComponent } from '../ride-time-item/ride-time-item.component';

@Component({
    selector: 'app-ride-create-form',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        TableModule,
        RidePriceItemComponent,
        RideTimeItemComponent,
        ReactiveFormsModule,
        TagModule,
        ButtonModule,
        InputTextModule,
        CalendarModule,
    ],
    templateUrl: './ride-create-form.component.html',
    styleUrl: './ride-create-form.component.scss',
})
export class RideCreateFormComponent implements OnInit {
    private store = inject(Store);

    @Input() public carriages: Carriage[] = [];
    @Input() public rides: ScheduleRide | null = null;
    @Input() public routeId!: number;

    public minDate = new Date();

    constructor(
        private errorMessageService: ErrorMessageService,
        private schedulesService: SchedulesService,
        private fb: FormBuilder
    ) {}

    public get form() {
        return this.schedulesService.createRideForm;
    }

    get segments(): FormArray {
        return this.form.controls[CreateRideFormFields.SEGMENTS] as FormArray;
    }

    getTimes(index: number): FormArray {
        return this.segments.at(index).get(CreateSegmentsFormFields.TIME) as FormArray;
    }

    getPrices(index: number): FormArray {
        return this.segments.at(index).get(CreateSegmentsFormFields.PRICES) as FormArray;
    }

    public get priceFields() {
        return CreatePriceFormFields;
    }

    public get timeFields() {
        return RideTimeCreateFormFields;
    }

    public handleArrivalErrorMessages(errors: ValidationErrors | null): string[] {
        return this.errorMessageService.getArrivalErrorMessages(errors);
    }

    public handleDepartureErrorMessages(errors: ValidationErrors | null): string[] {
        return this.errorMessageService.getDepartureErrorMessages(errors);
    }

    public handlePriceErrorMessages(errors: ValidationErrors | null): string[] {
        return this.errorMessageService.getPriceErrorMessages(errors);
    }

    ngOnInit() {
        this.form.reset();
        this.segments.reset();
        this.segments.clear();
        this.form.patchValue({
            [CreateRideFormFields.ID]: this.rides?.id,
        });
        const path = this.rides?.path || [];
        const carriages = Array.from(new Set(this.rides?.carriages));
        this.createSegmentsFormArray(path, carriages);
    }

    createSegmentsFormArray(path: number[], carriages: string[]) {
        this.segments.clear();
        let i = 0;
        path?.forEach((item) => {
            const segmentGroup = this.fb.group({
                [CreateSegmentsFormFields.ID]: item,
                [CreateSegmentsFormFields.CITY]: item,
                [CreateSegmentsFormFields.TIME]: this.fb.array([]),
                [CreateSegmentsFormFields.PRICES]: this.fb.array([]),
            });

            this.segments.push(segmentGroup);
            this.createTimeFormArray(path, i);
            this.createPricesFormArray(carriages, i, path.length);
            i += 1;
        });
    }

    createTimeFormArray(path: number[], index: number) {
        const timeArray = this.getTimes(index);

        timeArray.clear();

        const timeFormGroupConfig: Partial<RideTimeCreateForm> = {};
        if (index !== path.length - 1) {
            timeFormGroupConfig[RideTimeCreateFormFields.DEPARTURE] = ['', [Validators.required]];
        }

        if (index !== 0) {
            timeFormGroupConfig[RideTimeCreateFormFields.ARRIVAL] = ['', [Validators.required]];
        }

        timeArray.push(this.fb.group(timeFormGroupConfig));
    }

    createPricesFormArray(carriages: string[], index: number, pathLength: number) {
        const pricesArray = this.getPrices(index);

        pricesArray.clear();
        carriages?.forEach((item) => {
            if (index !== pathLength - 1) {
                pricesArray.push(
                    this.fb.group({
                        [CreatePriceFormFields.ID]: item,
                        [CreatePriceFormFields.NAME]: item,
                        [CreatePriceFormFields.VALUE]: [
                            null,
                            [Validators.required, Validators.min(1), Validators.max(9999)],
                        ],
                    })
                );
            }
        });
    }

    stationsMap: Map<number, Observable<Station | null>> = new Map();

    getStation(id: number): Observable<Station | null> {
        if (!this.stationsMap.has(id)) {
            const stationSelector = selectStationById(id);
            const station$ = this.store.select(stationSelector);
            this.stationsMap.set(id, station$);
        }
        return this.stationsMap.get(id) || of(null);
    }

    onSaveRide(): void {
        const routeId: number | null = this.form.get([CreateRideFormFields.ID])?.value;
        if (!routeId) return;
        const segmentsForm = this.form.get([CreateRideFormFields.SEGMENTS])?.value;

        const mappedSegments: Segment[] = [];

        const mapToNameValueObject = (
            array: { id: string; name: string; value: number }[]
        ): { [key: string]: number } =>
            array.reduce((obj, { name, value }) => ({ ...obj, [name]: value }), {} as { [key: string]: number });

        for (let i = 0; i < (this.rides?.path?.length || 0) - 1; i += 1) {
            const timeArray: [string, string] = [
                new Date(segmentsForm[i].time[0].departure).toISOString(),
                new Date(segmentsForm[i + 1].time[0].arrival).toISOString(),
            ] as [string, string];
            const segment = {
                time: timeArray,
                price: mapToNameValueObject(segmentsForm[i].prices),
            };
            mappedSegments.push(segment);
        }

        this.store.dispatch(
            AppSchedulesActions.initSaveNewSchedule({
                routeId,
                segments: mappedSegments,
            })
        );
    }

    onCancelRide(): void {
        this.form.reset();
        this.store.dispatch(AppSchedulesActions.hideFormSchedule());
    }
}
