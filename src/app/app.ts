import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { ProgressService } from './core/services';

import '@esri/calcite-components/components/calcite-button';
import '@esri/calcite-components/components/calcite-dropdown';
import '@esri/calcite-components/components/calcite-dropdown-group';
import '@esri/calcite-components/components/calcite-dropdown-item';

@Component({
  imports: [RouterLink, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class App {
  private readonly router = inject(Router);
  private readonly progress = inject(ProgressService);
  private readonly titleService = inject(Title);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected readonly isDashboard = computed(() => this.currentUrl().split(/[?#]/, 1)[0] === '/');
  protected readonly selectedYear = this.progress.selectedYear;
  protected readonly yearOptions = this.progress.yearOptions;
  protected readonly solvedCount = this.progress.solvedCount;
  protected readonly totalStars = this.progress.totalStars;

  constructor() {
    effect(() => this.titleService.setTitle(`Advent of Code ${this.selectedYear()}`));
  }

  protected selectYear(year: number): void {
    this.progress.setSelectedYear(year);
  }
}
