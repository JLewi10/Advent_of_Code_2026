import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

import '@esri/calcite-components/components/calcite-card';
import '@esri/calcite-components/components/calcite-icon';
import '@esri/calcite-components/components/calcite-meter';

type DayStatus = 'not-started' | 'in-progress' | 'partially-solved' | 'fully-solved';
type DayFilter = 'all' | DayStatus;

interface PuzzleDay {
  number: number;
  title: string;
  status: DayStatus;
  stars: number;
}

@Component({
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  protected readonly totalStars = 50;
  protected readonly days: PuzzleDay[] = Array.from({ length: 25 }, (_, index) => {
    const number = index + 1;
    return {
      number,
      title: `Day ${number} Puzzle`,
      status: 'not-started',
      stars: 0,
    };
  });
  protected readonly statusLabels: Record<DayStatus, string> = {
    'not-started': 'Not Started',
    'in-progress': 'In Progress',
    'partially-solved': 'Part 1 Solved',
    'fully-solved': 'Fully Solved',
  };
  protected readonly filters: { label: string; value: DayFilter }[] = [
    { label: 'All Days', value: 'all' },
    { label: 'Not Started', value: 'not-started' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Part 1 Solved', value: 'partially-solved' },
    { label: 'Fully Solved', value: 'fully-solved' },
  ];

  protected readonly activeFilter = signal<DayFilter>('all');
  protected readonly searchQuery = signal('');
  protected readonly solvedStars = computed(() =>
    this.days.reduce((total, day) => total + day.stars, 0),
  );
  protected readonly progressPercent = computed(() =>
    Math.round((this.solvedStars() / this.totalStars) * 100),
  );
  protected readonly filteredDays = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const filter = this.activeFilter();

    return this.days.filter((day) => {
      const matchesFilter = filter === 'all' || day.status === filter;
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
}
