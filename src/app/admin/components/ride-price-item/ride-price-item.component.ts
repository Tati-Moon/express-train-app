import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

import { Schedule } from '../../../core/models/schedules/schedule.model';
import { CreatePriceFormFields, PriceCreateFormFields } from '../../models/ride-create-form.model';
import { ErrorMessageService } from '../../services/error-message.service';

@Component({
    selector: 'app-ride-price-item',
    standalone: true,
    imports: [
        ButtonModule,
        TranslateModule,
        CommonModule,
        TagModule,
        InputTextModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './ride-price-item.component.html',
    styleUrls: ['./ride-price-item.component.scss'],
})
export class RidePriceItemComponent {
    @Input() public schedule!: Schedule;
    @Input() public index: number | null = 0;
    @Input() public editPriceIndex: number | null = 0;
    @Input() public selectedRideId: number | null = 0;
    @Output() public cancelEdit = new EventEmitter<void>();
    @Output() public editPrices = new EventEmitter<void>();
    @Output() public savePrices = new EventEmitter<Schedule>();

    pricesForm!: FormGroup;

    public get priceFields() {
        return PriceCreateFormFields;
    }

    public get fields() {
        return CreatePriceFormFields;
    }

    constructor(
        private errorMessageService: ErrorMessageService,
        private fb: FormBuilder
    ) {
        this.pricesForm = this.fb.group({
            prices: this.fb.array([]),
        });
    }

    get prices(): FormArray {
        return this.pricesForm.controls[PriceCreateFormFields.PRICES] as FormArray;
    }

    public onSavePrices() {
        const updatedSchedule = this.updateScheduleWithNewPrices(this.index ?? 0, this.schedule);
        this.savePrices.emit(updatedSchedule);
    }

    mapToNameValueObject = (array: { id: string; name: string; value: number }[]): { [key: string]: number } =>
        array.reduce((obj, { name, value }) => ({ ...obj, [name]: value }), {} as { [key: string]: number });

    private updateScheduleWithNewPrices(index: number, schedule: Schedule): Schedule {
        const updatedSegments = schedule.segments.map((segment, segIndex) => {
            if (segIndex === index) {
                return {
                    ...segment,
                    price: this.mapToNameValueObject(this.pricesForm.controls[PriceCreateFormFields.PRICES].value),
                };
            }
            return segment;
        });

        const updatedSchedule = {
            ...schedule,
            segments: updatedSegments,
        };

        return updatedSchedule;
    }

    public onEditPrices() {
        const pricesArray = this.pricesForm.get(this.priceFields.PRICES) as FormArray;
        pricesArray.clear();
        this.createPricesFormArray(this.schedule?.segments[this.index ?? 0].price);
        this.editPrices.emit();
    }

    public onCancelEdit() {
        this.cancelEdit.emit();
    }

    createPricesFormArray(price: Record<string, number>) {
        const pricesArray = this.pricesForm.get(this.priceFields.PRICES) as FormArray;
        pricesArray.clear();

        Object.entries(price).forEach(([key, value]) => {
            pricesArray.push(
                this.fb.group({
                    [CreatePriceFormFields.ID]: key,
                    [CreatePriceFormFields.NAME]: key,
                    [CreatePriceFormFields.VALUE]: [
                        value,
                        [Validators.required, Validators.min(1), Validators.max(9999)],
                    ],
                })
            );
        });
    }

    public handlePriceErrorMessages(errors: ValidationErrors | null): string[] {
        return this.errorMessageService.getPriceErrorMessages(errors);
    }

    getObjectKeys(obj: Record<string, number>): string[] {
        return Object.keys(obj);
    }
}
