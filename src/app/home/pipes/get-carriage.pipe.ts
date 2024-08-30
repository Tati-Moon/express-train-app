import { Pipe, PipeTransform } from '@angular/core';

import { V2CarriagesInfo } from '../models/v2-trip-carriage.model';

@Pipe({
    name: 'getCarriage',
    standalone: true,
})
export class GetCarriagePipe implements PipeTransform {
    transform(carriages: V2CarriagesInfo[] | null, type: string): V2CarriagesInfo[] | null {
        if (carriages) {
            return carriages.filter((carriage: V2CarriagesInfo) => carriage.type === type);
        }
        return null;
    }
}
