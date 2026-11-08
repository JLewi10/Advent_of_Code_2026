import { Service, computed, signal } from '@angular/core';

export const DAY_STATUSES = [
  { label: 'Not Started', value: 'not-started' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Part 1 Solved', value: 'partially-solved' },
  { label: 'Fully Solved', value: 'fully-solved' },
] as const;

export type DayStatus = (typeof DAY_STATUSES)[number]['value'];

export interface PuzzleDay {
  number: number;
  title: string;
  status: DayStatus;
  stars: number;
}

export const DAY_STATUS_LABELS = Object.fromEntries(
  DAY_STATUSES.map(({ label, value }) => [value, label]),
) as Record<DayStatus, string>;

export const TOTAL_STARS = 50;

const STORAGE_KEY = 'advent-of-code-2026.days';
const DAY_COUNT = 25;

@Service()
export class ProgressService {
  private readonly _storageError = signal<string | null>(null);
  private readonly _days = signal(this.loadDays());

  readonly days = this._days.asReadonly();
  readonly storageError = this._storageError.asReadonly();
  readonly solvedCount = computed(() =>
    this.days().reduce((total, day) => total + day.stars, 0),
  );

  getDayTitle(dayNumber: number | null): string {
    if (dayNumber === null) {
      return '';
    }

    return this.days().find((day) => day.number === dayNumber)?.title ?? `Day ${dayNumber} Puzzle`;
  }

  updateDay(dayNumber: number, changes: Partial<PuzzleDay>): void {
    const currentDays = this.days();
    const dayIndex = currentDays.findIndex((day) => day.number === dayNumber);
    if (dayIndex < 0) {
      return;
    }

    const updatedDays = currentDays.map((day) =>
      day.number === dayNumber
        ? {
            ...day,
            ...changes,
            stars: changes.status
              ? this.starsForStatus(changes.status)
              : (changes.stars ?? day.stars),
          }
        : day,
    );

    this._days.set(updatedDays);
    this.persistDays(updatedDays);
  }

  private createDefaultDays(): PuzzleDay[] {
    return Array.from({ length: DAY_COUNT }, (_, index) => {
      const number = index + 1;
      return {
        number,
        title: `Day ${number} Puzzle`,
        status: 'not-started',
        stars: 0,
      };
    });
  }

  private loadDays(): PuzzleDay[] {
    try {
      const storedDays = localStorage.getItem(STORAGE_KEY);
      if (storedDays === null) {
        return this.createDefaultDays();
      }

      const parsedDays: unknown = JSON.parse(storedDays);
      if (!Array.isArray(parsedDays)) {
        throw new Error('Saved progress must be a list of days.');
      }

      const defaults = this.createDefaultDays();
      const daysByNumber = new Map<number, PuzzleDay>();
      for (const savedDay of parsedDays) {
        if (
          typeof savedDay !== 'object' ||
          savedDay === null ||
          !('number' in savedDay) ||
          !('title' in savedDay) ||
          !('status' in savedDay) ||
          !('stars' in savedDay) ||
          typeof savedDay.number !== 'number' ||
          !Number.isInteger(savedDay.number) ||
          savedDay.number < 1 ||
          savedDay.number > defaults.length ||
          typeof savedDay.title !== 'string' ||
          !this.isDayStatus(savedDay.status) ||
          typeof savedDay.stars !== 'number' ||
          !Number.isInteger(savedDay.stars) ||
          savedDay.stars < 0 ||
          savedDay.stars > 2 ||
          daysByNumber.has(savedDay.number)
        ) {
          throw new Error('Saved progress contains an invalid day entry.');
        }

        daysByNumber.set(savedDay.number, {
          number: savedDay.number,
          title: savedDay.title,
          status: savedDay.status,
          stars: savedDay.stars,
        });
      }

      return defaults.map((day) => daysByNumber.get(day.number) ?? day);
    } catch (error) {
      const details = error instanceof Error ? error.message : 'Unknown storage error.';
      this._storageError.set(`Could not load saved progress: ${details}`);
      return this.createDefaultDays();
    }
  }

  private persistDays(days: PuzzleDay[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
      this._storageError.set(null);
    } catch (error) {
      const details = error instanceof Error ? error.message : 'Unknown storage error.';
      this._storageError.set(`Could not save progress to this browser: ${details}`);
    }
  }

  private isDayStatus(status: unknown): status is DayStatus {
    return DAY_STATUSES.some((option) => option.value === status);
  }

  private starsForStatus(status: DayStatus): number {
    if (status === 'partially-solved') {
      return 1;
    }
    return status === 'fully-solved' ? 2 : 0;
  }
}
