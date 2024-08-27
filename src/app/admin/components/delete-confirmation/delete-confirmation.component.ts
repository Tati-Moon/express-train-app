import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
    standalone: true,
    imports: [DialogModule, ButtonModule, TranslateModule],
    selector: 'app-delete-confirmation',
    templateUrl: './delete-confirmation.component.html',
    styleUrls: ['./delete-confirmation.component.scss'],
})
export class DeleteConfirmationComponent {
    @Input() visible: boolean = false;
    @Input() routeId!: number;
    @Input() header!: string;
    @Input() message!: string;
    @Output() confirm: EventEmitter<number> = new EventEmitter<number>();
    @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

    onConfirm(): void {
        this.confirm.emit(this.routeId);
    }

    onCancel(): void {
        this.cancel.emit();
    }
}
