import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    // eslint-disable-next-line class-methods-use-this
    public setItem(key: string, value: unknown): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    public getItem<T = unknown>(key: string): T | null {
        if (!this.hasItem(key)) return null;

        return JSON.parse(localStorage.getItem(key) as string);
    }

    public removeItem(key: string): void {
        if (!this.hasItem(key)) return;
        localStorage.removeItem(key);
    }
    // eslint-disable-next-line class-methods-use-this
    public clear(): void {
        localStorage.clear();
    }
    // eslint-disable-next-line class-methods-use-this
    public hasItem(key: string) {
        return localStorage.getItem(key) !== null;
    }

    public removeItems(items: string[]): void {
        if (items.length === 0) return;
        items.forEach((item) => {
            this.removeItem(item);
        });
    }
}
