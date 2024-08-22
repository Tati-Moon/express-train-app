import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarriageCreateFormComponent } from './carriage-create-form.component';

describe('CarriageCreateFormComponent', () => {
    let component: CarriageCreateFormComponent;
    let fixture: ComponentFixture<CarriageCreateFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CarriageCreateFormComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CarriageCreateFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
