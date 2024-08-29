import { Pipe, PipeTransform } from '@angular/core';

import { V2CarriagesInfo } from '../models/v2-trip-carriage.model';

@Pipe({
    name: 'getAvailableSeats',
    standalone: true,
})
export class GetAvailableSeatsPipe implements PipeTransform {
    transform(carriages: V2CarriagesInfo[] | null, type: string): number | null {
        if (carriages) {
            return carriages
                .filter((carriage: V2CarriagesInfo) => carriage.type === type)
                .reduce((sum: number, carriage: V2CarriagesInfo) => sum + carriage.availableSeats, 0);
        }
        return null;
    }
}
