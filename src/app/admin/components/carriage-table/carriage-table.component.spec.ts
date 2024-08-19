import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarriageTableComponent } from './carriage-table.component';

describe('CarriageTableComponent', () => {
    let component: CarriageTableComponent;
    let fixture: ComponentFixture<CarriageTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CarriageTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CarriageTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
