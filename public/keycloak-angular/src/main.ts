import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Standalone bootstrap (Angular 21).  No NgModule, no zone.js by default.
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
