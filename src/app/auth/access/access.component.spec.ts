import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { Schemes } from '../../core/models/enums/constants';
import { selectColorScheme } from '../../redux/selectors/app-theme.selector';
import { AccessComponent } from './access.component';

describe('AccessComponent', () => {
    let component: AccessComponent;
    let fixture: ComponentFixture<AccessComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, TranslateModule.forRoot(), ButtonModule, RippleModule, AccessComponent],
            providers: [
                provideMockStore({
                    selectors: [{ selector: selectColorScheme, value: Schemes.DARK }],
                }),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AccessComponent);
        component = fixture.componentInstance;
        TestBed.inject(MockStore);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize colorScheme from store', () => {
        expect(component.colorScheme()).toBe(Schemes.DARK);
    });
});
