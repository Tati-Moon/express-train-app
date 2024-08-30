import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

import { Schedule } from '../../../core/models/schedules/schedule.model';
import { PriceCreateFormFields } from '../../models/ride-create-form.model';

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
    @Output() public editPrices = new EventEmitter<void>();
    @Output() public savePrices = new EventEmitter<Schedule>();

    pricesForm!: FormGroup;

    public get priceFields() {
        return PriceCreateFormFields;
    }

    constructor(private fb: FormBuilder) {
        this.pricesForm = this.fb.group({
            prices: this.fb.array([]),
        });
    }

    get prices(): FormArray {
        return this.pricesForm.controls[PriceCreateFormFields.PRICES] as FormArray;
    }

    public onEditPrices() {
        const pricesArray = this.pricesForm.get(this.priceFields.PRICES) as FormArray;
        pricesArray.clear();
        pricesArray.push(this.createPriceFormGroup(this.schedule?.segments[this.index ?? 0].price));
        this.editPrices.emit();
    }

    public onSavePrices() {
        const updatedSchedule = this.updateScheduleWithNewPrices(this.index ?? 0, this.schedule);
        console.log('ОТПРАВИТЬ В СЕРВИС ДЛЯ СОХРАНЕНИЯ:', updatedSchedule);
        this.savePrices.emit(updatedSchedule);
    }

    private updateScheduleWithNewPrices(index: number, schedule: Schedule): Schedule {
        const updatedSegments = schedule.segments.map((segment, segIndex) => {
            if (segIndex === index) {
                return {
                    ...segment,
                    price: { ...this.pricesForm?.value?.prices[0] },
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

    createPriceFormGroup(prices: Record<string, number>): FormGroup {
        const priceFormControls = Object.entries(prices).reduce(
            (acc, [key, value]) => {
                acc[key] = [value, []];
                return acc;
            },
            {} as { [key: string]: [number, ValidatorFn[]] }
        );

        return this.fb.group(priceFormControls);
    }

    getObjectKeys(obj: Record<string, number>): string[] {
        return Object.keys(obj);
    }
}
