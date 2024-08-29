import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarriageViewComponent } from './carriage-view.component';

describe('CarriageViewComponent', () => {
    let component: CarriageViewComponent;
    let fixture: ComponentFixture<CarriageViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CarriageViewComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CarriageViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
