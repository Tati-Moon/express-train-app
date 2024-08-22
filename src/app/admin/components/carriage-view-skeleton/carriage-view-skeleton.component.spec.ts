import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarriageViewSkeletonComponent } from './carriage-view-skeleton.component';

describe('CarriageViewSkeletonComponent', () => {
    let component: CarriageViewSkeletonComponent;
    let fixture: ComponentFixture<CarriageViewSkeletonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CarriageViewSkeletonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CarriageViewSkeletonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
