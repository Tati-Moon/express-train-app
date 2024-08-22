import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-carriage-view-skeleton',
    standalone: true,
    imports: [SkeletonModule],
    templateUrl: './carriage-view-skeleton.component.html',
    styleUrl: './carriage-view-skeleton.component.scss',
})
export class CarriageViewSkeletonComponent {
    public get rows(): number[] {
        return new Array(16);
    }

    public get rightSeats(): number[] {
        return new Array(3);
    }

    public get leftSeats(): number[] {
        return new Array(2);
    }
}
