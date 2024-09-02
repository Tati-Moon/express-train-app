import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { Routers } from '../../../core/models/enums/routers';
import { CarriagesComponent } from '../carriages/carriages.component';
import { RoutesComponent } from '../routes/routes.component';
import { StationsComponent } from '../stations/stations.component';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [
        RoutesComponent,
        NgOptimizedImage,
        ButtonModule,
        StationsComponent,
        CarriagesComponent,
        CardModule,
        TranslateModule,
    ],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
})
export class AdminComponent {
    constructor(private router: Router) {}

    navigateToStationsPage() {
        this.router.navigate([`${Routers.ADMIN}/${Routers.STATIONS}`]);
    }

    navigateToCarriagesPage() {
        this.router.navigate([`${Routers.ADMIN}/${Routers.CARRIAGES}`]);
    }

    navigateToRoutesPage() {
        this.router.navigate([`${Routers.ADMIN}/${Routers.ROUTES}`]);
    }
}
