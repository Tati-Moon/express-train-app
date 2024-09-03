import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class StringService {
    public capitalizeFirstLetter(str: string): string {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
