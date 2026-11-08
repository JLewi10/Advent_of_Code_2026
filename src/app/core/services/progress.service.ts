import { Service, computed, signal } from '@angular/core';
import {
  STARS_PER_DAY,
  starsForStatus,
  type DayChanges,
  type PuzzleDay,
} from '../models/day-progress';
import {
  CURRENT_YEAR,
  createDefaultDays,
  dayCountForYear,
  readDays,
  readSelectedYear,
  writeDays,
  writeSelectedYear,
  YEAR_OPTIONS,
} from './progress-storage';

@Service()
export class ProgressService {
  readonly yearOptions = YEAR_OPTIONS;

  private readonly _storageError = signal<string | null>(null);
  private readonly _selectedYear = signal(this.loadSelectedYear());
  private readonly _days = signal(this.loadDays(this._selectedYear()));

  readonly selectedYear = this._selectedYear.asReadonly();
  readonly days = this._days.asReadonly();
  readonly storageError = this._storageError.asReadonly();
  readonly dayCount = computed(() => dayCountForYear(this.selectedYear()));
  readonly totalStars = computed(() => this.dayCount() * STARS_PER_DAY);
  readonly solvedCount = computed(() => this.days().reduce((total, day) => total + day.stars, 0));

  getDayTitle(dayNumber: number | null): string {
    if (dayNumber === null) {
      return '';
    }

    return this.days().find((day) => day.number === dayNumber)?.title ?? `Day ${dayNumber} Puzzle`;
  }

  setSelectedYear(year: number): void {
    if (!this.yearOptions.includes(year)) {
      throw new RangeError(`Unsupported Advent of Code year: ${year}`);
    }
    if (year === this.selectedYear()) {
      return;
    }

    this._storageError.set(null);
    this._selectedYear.set(year);
    this.write('save the selected year', () => writeSelectedYear(year));
    this._days.set(this.loadDays(year));
  }

  updateDay(dayNumber: number, changes: DayChanges): void {
    const currentDays = this.days();
    const dayIndex = currentDays.findIndex((day) => day.number === dayNumber);
    if (dayIndex === -1) {
      return;
    }

    const updatedDays = currentDays.slice();
    const day = currentDays[dayIndex];
    updatedDays[dayIndex] = {
      ...day,
      ...changes,
      stars: changes.status ? starsForStatus(changes.status) : day.stars,
    };

    this._days.set(updatedDays);
    this.write('save progress', () => writeDays(this.selectedYear(), updatedDays));
  }

  private loadSelectedYear(): number {
    return this.read('load the selected year', CURRENT_YEAR, readSelectedYear);
  }

  private loadDays(year: number): PuzzleDay[] {
    return this.read('load saved progress', createDefaultDays(year), () => readDays(year));
  }

  private read<T>(action: string, fallback: T, load: () => T): T {
    try {
      return load();
    } catch (error) {
      this._storageError.set(`Could not ${action}: ${this.errorMessage(error)}`);
      return fallback;
    }
  }

  private write(action: string, save: () => void): void {
    try {
      save();
      this._storageError.set(null);
    } catch (error) {
      this._storageError.set(`Could not ${action} to this browser: ${this.errorMessage(error)}`);
    }
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown storage error.';
  }
}
