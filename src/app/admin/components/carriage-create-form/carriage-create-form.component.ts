import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { v4 as uuidv4 } from 'uuid';

import { Carriage } from '../../../core/models';
import { CarriageCreateFormFields } from '../../models/carriage-create-form.model';
import { CarriageCreateFormService } from '../../services/carriage-create-form.service';
import { ErrorMessageService } from '../../services/error-message.service';

@Component({
    selector: 'app-carriage-create-form',
    standalone: true,
    imports: [ButtonModule, ReactiveFormsModule, TranslateModule, PasswordModule, InputTextModule, InputNumberModule],
    templateUrl: './carriage-create-form.component.html',
    styleUrl: './carriage-create-form.component.scss',
})
export class CarriageCreateFormComponent implements OnInit {
    @Output() public discardCreateCarriage = new EventEmitter();
    @Output() public saveCarriage = new EventEmitter<Carriage>();
    constructor(
        private carriageCreateFormService: CarriageCreateFormService,
        private errorMessageService: ErrorMessageService
    ) {}
    ngOnInit(): void {
        this.form.get(this.fields.CODE)?.setValue(uuidv4());
    }

    public get form(): FormGroup {
        return this.carriageCreateFormService.carriageCreateForm;
    }

    public get fields() {
        return CarriageCreateFormFields;
    }

    public handleErrorMessages(errors: ValidationErrors | null): string[] {
        return this.errorMessageService.getErrorMessages(errors);
    }
    public handleDiscardCreateCarriage(): void {
        this.discardCreateCarriage.emit();
    }

    public handleSaveCarriage(form: FormGroup): void {
        if (form.valid) {
            this.saveCarriage.emit(form.value);
        }
    }
}
