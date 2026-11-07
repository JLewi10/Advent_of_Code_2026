import { bootstrapApplication } from '@angular/platform-browser';
import { defineCustomElements } from '@esri/calcite-components/loader';
import { appConfig } from './app/app.config';
import { App } from './app/app';

defineCustomElements();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
