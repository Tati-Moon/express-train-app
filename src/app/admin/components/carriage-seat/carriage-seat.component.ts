import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-carriage-seat',
    standalone: true,
    imports: [ButtonModule],
    templateUrl: './carriage-seat.component.html',
    styleUrl: './carriage-seat.component.scss',
})
export class CarriageSeatComponent {
    @Input() index: number | string = 0;
}
