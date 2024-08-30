import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideCreateFormComponent } from './ride-create-form.component';

describe('RideCreateFormComponent', () => {
    let component: RideCreateFormComponent;
    let fixture: ComponentFixture<RideCreateFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RideCreateFormComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(RideCreateFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
