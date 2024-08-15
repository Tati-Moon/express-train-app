import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

const test = 1;
console.log('🚀 ~ test:', test);

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
