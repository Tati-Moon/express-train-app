import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

import { Schedule } from '../../../core/models/schedules/schedule.model';
import { RideTimeCreateFormFields } from '../../models/ride-create-form.model';
import { ErrorMessageService } from '../../services/error-message.service';
import { SchedulesService } from '../../services/schedules.service';

@Component({
    selector: 'app-ride-time-item',
    standalone: true,
    imports: [
        ButtonModule,
        TranslateModule,
        CommonModule,
        TagModule,
        InputTextModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
    ],
    templateUrl: './ride-time-item.component.html',
    styleUrls: ['./ride-time-item.component.scss'],
})
export class RideTimeItemComponent {
    @Input() public schedule!: Schedule;
    @Input() public index!: number;
    @Input() public editTimeIndex: number | null = null;
    @Input() public selectedRideId: number | null = 0;
    @Output() public cancelEdit = new EventEmitter<void>();
    @Output() public editTimes = new EventEmitter<void>();
    @Output() public saveTimes = new EventEmitter<Schedule>();
    public minDate = new Date();

    public handleArrivalErrorMessages(errors: ValidationErrors | null): string[] {
        return this.errorMessageService.getArrivalErrorMessages(errors);
    }

    public handleDepartureErrorMessages(errors: ValidationErrors | null): string[] {
        return this.errorMessageService.getDepartureErrorMessages(errors);
    }

    constructor(
        private errorMessageService: ErrorMessageService,
        private schedulesService: SchedulesService
    ) {}

    public get fields() {
        return RideTimeCreateFormFields;
    }

    public get form() {
        return this.schedulesService.rideTimeCreateForm;
    }

    public onEditTimes() {
        if (this.index === 0) {
            this.form.patchValue({
                [this.fields.DEPARTURE]: new Date(this.schedule?.segments[this.index]?.time[0]),
                [this.fields.ARRIVAL]: '',
            });
        }
        if (this.index > 0 && this.index < this.schedule.segments.length) {
            this.form.patchValue({
                [this.fields.DEPARTURE]: new Date(this.schedule.segments[this.index]?.time[0]),
                [this.fields.ARRIVAL]: new Date(this.schedule.segments[this.index - 1]?.time[1]?.toString()),
            });
        }
        if (this.index === this.schedule.segments.length) {
            this.form.patchValue({
                [this.fields.DEPARTURE]: '',
                [this.fields.ARRIVAL]: new Date(this.schedule?.segments[this.index - 1]?.time[1]?.toString()),
            });
        }
        this.editTimes.emit();
    }

    public onCancelEdit() {
        this.cancelEdit.emit();
    }

    public onSaveTimes() {
        const updatedSegments = [...this.schedule.segments];

        if (this.index === 0) {
            const updatedTime: [string, string] = [...updatedSegments[this.index].time];
            updatedTime[0] = new Date(this.form.get([this.fields.DEPARTURE])?.value).toISOString();
            updatedSegments[this.index] = { ...updatedSegments[this.index], time: updatedTime };
        }

        if (this.index > 0 && this.index < this.schedule.segments.length) {
            const updatedDepartureTime: [string, string] = [...updatedSegments[this.index].time];
            updatedDepartureTime[0] = new Date(this.form.get([this.fields.DEPARTURE])?.value).toISOString();
            updatedSegments[this.index] = { ...updatedSegments[this.index], time: updatedDepartureTime };

            const updatedArrivalTime: [string, string] = [...updatedSegments[this.index - 1].time];
            updatedArrivalTime[1] = new Date(this.form.get([this.fields.ARRIVAL])?.value).toISOString();
            updatedSegments[this.index - 1] = { ...updatedSegments[this.index - 1], time: updatedArrivalTime };
        }

        if (this.index === this.schedule.segments.length) {
            const updatedFinalArrivalTime: [string, string] = [...updatedSegments[this.index - 1].time];
            updatedFinalArrivalTime[1] = new Date(this.form.get([this.fields.ARRIVAL])?.value).toISOString();
            updatedSegments[this.index - 1] = { ...updatedSegments[this.index - 1], time: updatedFinalArrivalTime };
        }

        this.schedule = { ...this.schedule, segments: updatedSegments };
        this.saveTimes.emit(this.schedule);
    }
}
