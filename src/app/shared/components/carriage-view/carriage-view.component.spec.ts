import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { selectBusySeats, selectSelectedSeat } from '../../../redux/selectors/app-trip.selector';
import { CarriageViewComponent } from './carriage-view.component';

describe('CarriageViewComponent', () => {
    let component: CarriageViewComponent;
    let fixture: ComponentFixture<CarriageViewComponent>;
    let store: MockStore;

    const initialState = {};

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CarriageViewComponent],
            providers: [provideMockStore({ initialState })],
        }).compileComponents();

        fixture = TestBed.createComponent(CarriageViewComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(MockStore);

        // Optionally set up selectors with mock return values
        store.overrideSelector(selectSelectedSeat, null);
        store.overrideSelector(selectBusySeats, []);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
