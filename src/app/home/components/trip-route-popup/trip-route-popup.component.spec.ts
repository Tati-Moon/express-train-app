import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripRoutePopupComponent } from './trip-route-popup.component';

describe('TripRoutePopupComponent', () => {
    let component: TripRoutePopupComponent;
    let fixture: ComponentFixture<TripRoutePopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TripRoutePopupComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TripRoutePopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
