import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDirectTrainsFoundComponent } from './no-direct-trains-found.component';

describe('NoDirectTrainsFoundComponent', () => {
    let component: NoDirectTrainsFoundComponent;
    let fixture: ComponentFixture<NoDirectTrainsFoundComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NoDirectTrainsFoundComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NoDirectTrainsFoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
