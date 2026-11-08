import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProgressService } from '../../core/services';

import '@esri/calcite-components/components/calcite-button';
import '@esri/calcite-components/components/calcite-chip';
import '@esri/calcite-components/components/calcite-icon';

@Component({
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-day',
  styleUrl: './day.scss',
  templateUrl: './day.html',
})
export class Day {
  private readonly route = inject(ActivatedRoute);
  private readonly progress = inject(ProgressService);
  private readonly routeParams = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  protected readonly dayNumber = computed(() => {
    const number = Number(this.routeParams().get('dayNumber'));
    return Number.isInteger(number) && number >= 1 && number <= 25 ? number : null;
  });
  protected readonly dayLabel = computed(() => {
    return this.progress.getDayTitle(this.dayNumber());
  });
  protected readonly sourceCode = signal('');
  protected readonly puzzleInput = signal('');
  protected readonly executionMessage = signal(
    'Write a solution, then run it to see execution results here.',
  );
  protected readonly runTime = signal('0.00 ms');

  protected updateSourceCode(event: Event): void {
    this.sourceCode.set((event.target as HTMLTextAreaElement).value);
  }

  protected updatePuzzleInput(event: Event): void {
    this.puzzleInput.set((event.target as HTMLTextAreaElement).value);
  }

  protected runCode(): void {
    this.executionMessage.set(
      this.sourceCode().trim()
        ? 'Code execution is not configured yet. Your solution and puzzle input are preserved.'
        : 'Enter a solution before running code.',
    );
    this.runTime.set('—');
  }
}
