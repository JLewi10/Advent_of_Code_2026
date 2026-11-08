import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import '@esri/calcite-components/components/calcite-icon';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-page-not-found',
  styleUrl: './page-not-found.scss',
  templateUrl: './page-not-found.html',
})
export class PageNotFound {}
