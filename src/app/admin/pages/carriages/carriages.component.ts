import { Component, inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { Carriage } from '../../../core/models';
import { AppCarriagesActions } from '../../../redux/actions/app-carriages.actions';
import { selectCarriages, selectCreateCarriageState } from '../../../redux/selectors/app-carriages.selector';
import { CarriageCreateFormComponent } from '../../components/carriage-create-form/carriage-create-form.component';
import { CarriageTableComponent } from '../../components/carriage-table/carriage-table.component';
import { CarriageViewComponent } from '../../components/carriage-view/carriage-view.component';
import { CarriageCreateFormService } from '../../services/carriage-create-form.service';

@Component({
    selector: 'app-carriages',
    standalone: true,
    imports: [
        ButtonModule,
        TableModule,
        CarriageTableComponent,
        CarriageCreateFormComponent,
        CarriageViewComponent,
        TranslateModule,
    ],
    templateUrl: './carriages.component.html',
    styleUrl: './carriages.component.scss',
})
export class CarriagesComponent implements OnInit {
    private store = inject(Store);
    private carriageFormService = inject(CarriageCreateFormService);

    public createCarriageState!: Signal<boolean>;
    public carriages!: Signal<Carriage[]>;

    public get form(): FormGroup {
        return this.carriageFormService.carriageCreateForm;
    }

    public get formValue() {
        if (this.form.valid) {
            return this.form.value as Carriage;
        }
        return null;
    }

    constructor() {
        const createCarriageState$ = this.store.select(selectCreateCarriageState);
        this.createCarriageState = toSignal(createCarriageState$, { initialValue: false });

        const carriages$ = this.store.select(selectCarriages);
        this.carriages = toSignal(carriages$, { initialValue: [] });
    }

    ngOnInit(): void {
        this.store.dispatch(AppCarriagesActions.loadCarriages());
    }

    public handleCreateCarriage(): void {
        this.store.dispatch(AppCarriagesActions.initCreateCarriage());
    }

    public handleDiscardCreateCarriage(): void {
        this.store.dispatch(AppCarriagesActions.discardCreateCarriage());
    }

    public handleSaveCarriage(carriage: Carriage): void {
        this.store.dispatch(AppCarriagesActions.initSaveNewCarriage({ carriage }));
    }
}
