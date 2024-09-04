import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, timeout } from 'rxjs';

import { MessagesService } from './messages.service';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    constructor(
        private http: HttpClient,
        private messagesService: MessagesService
    ) {}

    public get<T>({
        url,
        params,
        headers,
    }: {
        url: string;
        params?: HttpParams;
        headers?: HttpHeaders;
    }): Observable<T> {
        return this.http.get<T>(url, { params, headers });
    }

    public post<T>({
        url,
        body,
        formData,
        params,
        headers,
    }: {
        url: string;
        body?: unknown;
        formData?: FormData;
        params?: HttpParams;
        headers?: HttpHeaders;
    }): Observable<T> {
        const defaultHeaders = new HttpHeaders().set('Content-Type', 'application/json');

        if (formData) {
            return this.http.post<T>(url, formData, { params });
        }

        const newHeaders = headers
            ? headers.keys().reduce((merged, key) => merged.append(key, headers.getAll(key)!), defaultHeaders)
            : defaultHeaders;

        const jsonBody = body ? JSON.stringify(body) : undefined;

        return this.http.post<T>(url, jsonBody, { params, headers: newHeaders }).pipe(
            timeout(100000),
            catchError((error) => {
                if (error?.error?.message) {
                    return throwError(() => ({
                        status: 400,
                        message: error?.error?.message,
                        reason: error?.error?.reason,
                    }));
                }
                if (error.name === 'TimeoutError') {
                    this.messagesService.sendError('TimeoutError');
                }
                return throwError(() => ({
                    status: 400,
                    message: 'TimeoutError',
                    error: 'TimeoutError',
                }));
            })
        );
    }

    public put<T>({
        url,
        body,
        params,
        headers,
    }: {
        url: string;
        body: unknown;
        params?: HttpParams;
        headers?: HttpHeaders;
    }): Observable<T> {
        return this.http.put<T>(url, body, { params, headers });
    }

    public delete<T>({
        url,
        params,
        headers,
    }: {
        url: string;
        params?: HttpParams;
        headers?: HttpHeaders;
    }): Observable<T> {
        console.log('🚀 ~ HttpService ~ url:', url);
        return this.http.delete<T>(url, { params, headers });
    }

    public patch<T>({
        url,
        body,
        formData,
        params,
        headers,
    }: {
        url: string;
        body?: unknown;
        formData?: FormData;
        params?: HttpParams;
        headers?: HttpHeaders;
    }): Observable<T> {
        const defaultHeaders = new HttpHeaders().set('Content-Type', 'application/json');

        if (formData) {
            return this.http.patch<T>(url, formData, { params });
        }

        const newHeaders = headers
            ? headers.keys().reduce((merged, key) => merged.append(key, headers.getAll(key)!), defaultHeaders)
            : defaultHeaders;

        return this.http.patch<T>(url, body, { params, headers: newHeaders });
    }
}
