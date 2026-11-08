import { isPuzzleDay, MAX_DAY_NUMBER, STARS_PER_DAY, type PuzzleDay } from '../models/day-progress';

const FIRST_YEAR = 2015;
export const CURRENT_YEAR = new Date().getFullYear();
export const DEFAULT_DAY_COUNT = MAX_DAY_NUMBER;
const YEAR_DAY_COUNTS: Readonly<Record<number, number>> = { 2025: 12 };
const SELECTED_YEAR_KEY = 'advent-of-code.selectedYear';

export const YEAR_OPTIONS = Object.freeze(
  Array.from({ length: CURRENT_YEAR - FIRST_YEAR + 1 }, (_, index) => CURRENT_YEAR - index),
);

export function dayCountForYear(year: number): number {
  return YEAR_DAY_COUNTS[year] ?? DEFAULT_DAY_COUNT;
}

export function createDefaultDays(year: number): PuzzleDay[] {
  return Array.from({ length: dayCountForYear(year) }, (_, index) => {
    const number = index + 1;
    return {
      number,
      title: `Day ${number} Puzzle`,
      status: 'not-started',
      stars: 0,
    };
  });
}

export function readSelectedYear(): number {
  const savedYear = localStorage.getItem(SELECTED_YEAR_KEY);
  if (savedYear === null) {
    return CURRENT_YEAR;
  }

  const year = Number(savedYear);
  if (Number.isInteger(year) && YEAR_OPTIONS.includes(year)) {
    return year;
  }
  throw new Error('Saved year is outside the supported range.');
}

export function writeSelectedYear(year: number): void {
  localStorage.setItem(SELECTED_YEAR_KEY, String(year));
}

export function readDays(year: number): PuzzleDay[] {
  const defaults = createDefaultDays(year);
  const savedDays = localStorage.getItem(storageKey(year));
  if (savedDays === null) {
    return defaults;
  }

  const parsedDays: unknown = JSON.parse(savedDays);
  if (!Array.isArray(parsedDays)) {
    throw new Error('Saved progress must be a list of days.');
  }

  const daysByNumber = new Map<number, PuzzleDay>();
  const seenNumbers = new Set<number>();
  for (const savedDay of parsedDays) {
    if (!isPuzzleDay(savedDay) || seenNumbers.has(savedDay.number)) {
      throw new Error('Saved progress contains an invalid day entry.');
    }

    seenNumbers.add(savedDay.number);
    if (savedDay.number <= defaults.length) {
      daysByNumber.set(savedDay.number, savedDay);
    }
  }

  return defaults.map((day) => daysByNumber.get(day.number) ?? day);
}

export function writeDays(year: number, days: PuzzleDay[]): void {
  localStorage.setItem(storageKey(year), JSON.stringify(days));
}

function storageKey(year: number): string {
  return `advent-of-code-${year}.days`;
}
