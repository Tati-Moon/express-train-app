import { Pipe, PipeTransform } from '@angular/core';

import { V2CarriagesInfo } from '../models/v2-trip-carriage.model';

@Pipe({
    name: 'getCarriagePrice',
    standalone: true,
})
export class GetCarriagePricePipe implements PipeTransform {
    transform(carriages: V2CarriagesInfo[] | null, type: string): number | null {
        if (carriages) {
            return carriages.find((carriage: V2CarriagesInfo) => carriage.type === type)?.price ?? null;
        }
        return null;
    }
}
