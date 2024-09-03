import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';

import { CarriageCreateFormService } from '../../services/carriage-create-form.service';
import { ErrorMessageService } from '../../services/error-message.service';
import { CarriageCreateFormComponent } from './carriage-create-form.component';

describe('CarriageCreateFormComponent', () => {
    let component: CarriageCreateFormComponent;
    let fixture: ComponentFixture<CarriageCreateFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, TranslateModule.forRoot()],
            providers: [provideMockStore({}), CarriageCreateFormService, ErrorMessageService],
        }).compileComponents();

        fixture = TestBed.createComponent(CarriageCreateFormComponent);
        component = fixture.componentInstance;
        TestBed.inject(CarriageCreateFormService);
        TestBed.inject(ErrorMessageService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
