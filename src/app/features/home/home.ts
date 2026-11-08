import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  DAY_STATUSES,
  DAY_STATUS_LABELS,
  ProgressService,
  TOTAL_STARS,
  type DayStatus,
  type PuzzleDay,
} from '../../core/services';

import '@esri/calcite-components/components/calcite-card';
import '@esri/calcite-components/components/calcite-icon';
import '@esri/calcite-components/components/calcite-meter';

type DayFilter = 'all' | DayStatus;

@Component({
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  protected readonly progress = inject(ProgressService);
  protected readonly totalStars = TOTAL_STARS;
  protected readonly days = this.progress.days;
  protected readonly editingDayNumber = signal<number | null>(null);
  protected readonly draftTitle = signal('');
  protected readonly draftStatus = signal<DayStatus>('in-progress');
  protected readonly editError = signal<string | null>(null);
  protected readonly statuses = DAY_STATUSES;
  protected readonly statusLabels = DAY_STATUS_LABELS;
  protected readonly filters: { label: string; value: DayFilter }[] = [
    { label: 'All Days', value: 'all' },
    ...DAY_STATUSES,
  ];

  protected readonly activeFilter = signal<DayFilter>('all');
  protected readonly searchQuery = signal('');
  protected readonly solvedStars = this.progress.solvedCount;
  protected readonly progressPercent = computed(() =>
    Math.round((this.solvedStars() / this.totalStars) * 100),
  );
  protected readonly filteredDays = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const filter = this.activeFilter();
    const editingDayNumber = this.editingDayNumber();

    return this.days().filter((day) => {
      const matchesFilter =
        filter === 'all' || day.status === filter || day.number === editingDayNumber;
      const dayNumber = day.number.toString();
      const paddedDayNumber = dayNumber.padStart(2, '0');
      const matchesSearch =
        query.length === 0 ||
        [
          dayNumber,
          paddedDayNumber,
          `day ${dayNumber}`,
          `day ${paddedDayNumber}`,
          day.title.toLowerCase(),
        ].some((searchableText) => searchableText.includes(query));

      return matchesFilter && matchesSearch;
    });
  });

  protected updateSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected setFilter(filter: DayFilter): void {
    this.activeFilter.set(filter);
  }

  protected beginEdit(day: PuzzleDay): void {
    const status = day.status === 'not-started' ? 'in-progress' : day.status;
    if (status !== day.status) {
      this.progress.updateDay(day.number, { status });
    }

    this.editingDayNumber.set(day.number);
    this.draftTitle.set(day.title);
    this.draftStatus.set(status);
    this.editError.set(null);
  }

  protected updateDraftTitle(event: Event): void {
    this.draftTitle.set((event.target as HTMLInputElement).value);
  }

  protected updateDraftStatus(event: Event): void {
    const status = (event.target as HTMLSelectElement).value;
    if (this.isDayStatus(status)) {
      this.draftStatus.set(status);
    }
  }

  protected saveDayEdit(day: PuzzleDay): void {
    const title = this.draftTitle().trim();
    if (!title) {
      this.editError.set('Enter a title for this day before saving.');
      return;
    }

    this.progress.updateDay(day.number, {
      title,
      status: this.draftStatus(),
    });
    this.editingDayNumber.set(null);
  }

  protected cancelDayEdit(): void {
    this.editingDayNumber.set(null);
    this.editError.set(null);
  }

  private isDayStatus(status: string): status is DayStatus {
    return DAY_STATUSES.some((option) => option.value === status);
  }
}
