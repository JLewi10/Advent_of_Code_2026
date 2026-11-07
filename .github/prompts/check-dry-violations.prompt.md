---
agent: 'agent'
description: 'Find and assess DRY violations in Angular v22 applications'
tools:
  [
    'changes',
    'fetch',
    'githubRepo',
    'problems',
    'runCommands',
    'runTasks',
    'read',
    'edit',
    'search',
    'web',
    'agent',
    'todo',
  ]
---

# Angular v22 DRY Violations Analysis

## Objective

Analyze Angular v22 application code for meaningful duplication and provide evidence-based, actionable refactoring recommendations. Focus on maintainability and consistency without recommending abstractions for coincidental similarities or one-off code.

## Scope and Version

1. Inspect the workspace configuration and dependencies to confirm the Angular version and identify application and library boundaries.
2. Analyze Angular v22 application code and its directly related tests. In a monorepo, keep findings scoped to Angular projects; exclude unrelated backend or non-Angular frontend code.
3. Use the project's established conventions and APIs. Treat Angular v22 behavior as the baseline: standalone declarations are the default, `OnPush` is the default change detection strategy, and Signal Forms are stable. Do not flag these defaults as missing configuration or recommend obsolete patterns as the preferred fix.
4. If the project is not actually on Angular v22, state the detected version and avoid applying v22-specific assumptions.

## Areas to Analyze

### Components, Directives, and Templates

- Repeated UI structure, interaction behavior, validation messages, and accessibility markup
- Components with substantially duplicated responsibilities or overly similar input/output APIs
- Repeated template expressions, conditionals, formatting, and `@if`, `@for`, or `@switch` blocks
- Repeated host bindings, event handling, and directive behavior
- Duplicated styles, design tokens, and responsive or accessibility rules

### State and Data Flow

- Repeated signal state transitions, derived state, and computed expressions
- Similar component workflows that could reasonably share a focused service or reusable UI component
- Repeated observable subscriptions, transformations, and loading/error state handling
- Duplicated input/output or model interactions
- Repeated state or caching logic across related features

Prefer signals for local state and `computed()` for derived values where that fits the existing design. Do not recommend RxJS or signals mechanically; consider the data flow and existing architecture.

### Services, Dependency Injection, and HTTP

- Repeated API calls, request options, response mapping, and error handling
- Duplicated business rules or orchestration across services and components
- Repeated dependency-injection provider configuration or service setup
- Similar interceptors, guards, resolvers, and route data handling

Consider focused services and shared helpers where they reduce real duplication. Do not introduce generic CRUD layers, base classes, or abstractions that obscure feature-specific behavior.

### Forms and Validation

- Repeated field definitions, schemas, validators, cross-field rules, and error presentation
- Similar form submission, pending, and error workflows
- Inconsistent implementations of equivalent forms

For new form recommendations, consider Signal Forms (`@angular/forms/signals`) where appropriate; otherwise follow the project's existing form approach, preferring reactive forms over template-driven forms when introducing a non-Signal-Forms solution.

### Routes, Configuration, and Testing

- Repeated route definitions, lazy-loading patterns, guards, and resolvers
- Duplicated providers, environment configuration, or feature setup
- Repeated unit or component test setup, fixtures, and assertions

Recommend Angular-native patterns and preserve the project's test framework and architecture.

## Analysis Rules

- Verify each suspected violation by comparing the relevant code; cite exact file paths and line numbers.
- Distinguish true duplication from similar-looking code with different behavior, lifecycle, ownership, or change cadence.
- Estimate the amount and spread of duplication, and explain why a shared abstraction would remain cohesive.
- Respect current Angular v22 idioms, including signal APIs, native template control flow, functional `input()`/`output()`/`model()` APIs, and current dependency-injection conventions. Do not flag valid alternatives as violations solely for not using a preferred API.
- Do not modify code. Provide recommendations and examples only unless the user separately requests implementation.
- If no meaningful violations are found, say so and identify the areas examined; do not invent findings to fill the report.

## Severity and Impact

Rate each finding based on evidence, not just repetition count:

- **High**: Widespread or costly duplication that creates a substantial risk of inconsistent behavior or expensive changes.
- **Medium**: Clear duplication across multiple locations with a practical, cohesive reuse opportunity.
- **Low**: Small, localized duplication where the benefit of extraction is limited.

Also rate refactoring impact as **High**, **Medium**, or **Low**, based on the breadth of affected features and likely implementation effort.

## Deliverables

### 1. Violation Report

For each finding, include:

- A concise title and severity
- Exact file paths and line numbers for all representative instances
- The duplicated behavior or structure and its scope (instances, files, and approximate duplicated lines where practical)
- Why the duplication is likely to cause maintenance problems
- Refactoring impact and confidence

### 2. Recommendations

For each finding, propose the smallest suitable Angular v22-aligned refactoring. Explain what to extract or consolidate, where it belongs, and any trade-offs. Prioritize low-risk improvements before broader architectural changes.

### 3. Examples and Validation

Where useful, include concise before/after TypeScript or template examples. Suggest targeted tests that preserve behavior, accessibility, and relevant edge cases. Do not claim performance or bundle-size gains without evidence.

## Final Summary

End with a prioritized list of recommendations and a brief summary of the Angular areas examined. Keep findings actionable and avoid repeating the same duplication under multiple categories.
