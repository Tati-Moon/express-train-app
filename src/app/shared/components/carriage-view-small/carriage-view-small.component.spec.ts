import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarriageViewSmallComponent } from './carriage-view-small.component';

describe('CarriageViewComponent', () => {
    let component: CarriageViewSmallComponent;
    let fixture: ComponentFixture<CarriageViewSmallComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CarriageViewSmallComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CarriageViewSmallComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
