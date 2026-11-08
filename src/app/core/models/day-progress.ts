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

export type DayChanges = Partial<Pick<PuzzleDay, 'title' | 'status'>>;
export const STAR_VALUES = [1, 2] as const;
export const STARS_PER_DAY = STAR_VALUES.length;
export const MAX_DAY_NUMBER = 25;

export const DAY_STATUS_LABELS = Object.fromEntries(
  DAY_STATUSES.map(({ label, value }) => [value, label]),
) as Record<DayStatus, string>;

const STATUS_STARS: Record<DayStatus, number> = {
  'not-started': 0,
  'in-progress': 0,
  'partially-solved': 1,
  'fully-solved': STARS_PER_DAY,
};
const VALID_DAY_STATUSES = new Set<string>(DAY_STATUSES.map(({ value }) => value));

export function isDayStatus(value: unknown): value is DayStatus {
  return typeof value === 'string' && VALID_DAY_STATUSES.has(value);
}

export function starsForStatus(status: DayStatus): number {
  return STATUS_STARS[status];
}

export function isPuzzleDay(value: unknown): value is PuzzleDay {
  return (
    typeof value === 'object' &&
    value !== null &&
    'number' in value &&
    typeof value.number === 'number' &&
    Number.isInteger(value.number) &&
    value.number >= 1 &&
    value.number <= MAX_DAY_NUMBER &&
    'title' in value &&
    typeof value.title === 'string' &&
    'status' in value &&
    isDayStatus(value.status) &&
    'stars' in value &&
    typeof value.stars === 'number' &&
    Number.isInteger(value.stars) &&
    value.stars === starsForStatus(value.status)
  );
}
