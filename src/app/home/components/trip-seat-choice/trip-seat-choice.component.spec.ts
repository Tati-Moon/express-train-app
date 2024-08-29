import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripSeatChoiceComponent } from './trip-seat-choice.component';

describe('TripSeatChoiceComponent', () => {
    let component: TripSeatChoiceComponent;
    let fixture: ComponentFixture<TripSeatChoiceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TripSeatChoiceComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TripSeatChoiceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
