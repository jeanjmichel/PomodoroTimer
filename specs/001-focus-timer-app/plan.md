# Implementation Plan: Focus Timer App

**Branch**: `001-focus-timer-app` | **Date**: 2026-08-19 | **Spec**: `/specs/001-focus-timer-app/spec.md`

**Input**: Feature specification from `/specs/001-focus-timer-app/spec.md`

**Note**: This plan follows the project constitution and the current DDD/hexagonal guidance, while keeping the initial version intentionally small and practical.

## Summary

Build a responsive single-page productivity timer that supports focus and rest cycles, preset and custom durations, lifecycle controls, automatic loop mode, and visual/audio notifications without introducing unnecessary application complexity. The solution will separate timer rules from the UI so that the domain logic remains explicit, testable, and easy to reason about.

## Technical Context

**Language/Version**: TypeScript in strict mode with Next.js and React

**Primary Dependencies**: Next.js, React, TailwindCSS, Zod, Vitest, Testing Library

**Storage**: N/A for v1; no persistence required by the current specification

**Testing**: Vitest with jsdom and component tests for timer logic and UI behavior

**Target Platform**: Desktop and mobile web browsers

**Project Type**: web-application

**Performance Goals**: Timer updates remain accurate to within one second; transitions feel immediate and responsive on common desktop and mobile devices.

**Constraints**: No authentication; no database; browser audio support is optional but fallback visual notifications are required; delays must remain low and predictable.

**Scale/Scope**: Single-user demo application with one main timer screen and a limited set of interactions.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Spec-driven development: the feature is defined in the approved specification and the plan is derived from it.
- ✅ Domain-centric architecture: timer rules, state transitions, validation, and loop logic will live outside React components.
- ✅ Verification-driven quality: automated tests will cover the timer engine, validation logic, and relevant UI flows.
- ✅ Security and trustworthiness by default: no secrets, no auth, and all custom duration input will be validated with Zod.
- ✅ Simplicity and maintainability: the first version remains a focused, single-page productivity timer without unnecessary abstractions.

No constitutional or governance violations were identified for this feature.

## Project Structure

### Documentation (this feature)

```text
specs/001-focus-timer-app/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
├── checklist/           # quality checks
└── spec.md              # feature specification
```

### Source Code (repository root)

```text
app/
├── layout.tsx
├── page.tsx
├── globals.css
└── favicon.ico

components/
├── timer/
│   ├── TimerDashboard.tsx
│   ├── TimerControls.tsx
│   ├── TimerDisplay.tsx
│   └── TimerSettingsForm.tsx
├── ui/
│   └── NotificationBanner.tsx
└── shared/
    └── ProgressRing.tsx

domain/
├── timer/
│   ├── timer.types.ts
│   ├── timer.constants.ts
│   ├── timer-state.ts
│   ├── timer-rules.ts
│   ├── timer-validation.ts
│   └── timer-service.ts
└── notifications/
    └── notification.types.ts

hooks/
├── useTimer.ts
├── useNotification.ts
└── useCountdown.ts

lib/
├── format-time.ts
├── browser-audio.ts
└── cn.ts

stores/
└── timer-store.ts

tests/
├── unit/
│   ├── timer-rules.test.ts
│   ├── timer-validation.test.ts
│   └── timer-service.test.ts
├── integration/
│   └── timer-flow.test.tsx
└── setup.ts
```

**Structure Decision**: A simple Next.js app with a thin UI layer and a domain-focused timer module. Domain rules and timer behavior remain isolated from React, while hooks coordinate timer lifecycle updates and browser notifications.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No complexity exceptions are required for this version. The feature remains a focused, single-page productivity timer and does not justify additional architectural overhead beyond the domain/service split.

## Phase 0: Research

### Research Topics

- Confirm the simplest timer model for a browser-based countdown with pause/resume and loop transitions.
- Decide how to handle browser audio notifications without unnecessary user friction.
- Validate the best fit for custom duration input handling with Zod and minimal UI overhead.
- Confirm the appropriate state model for focus/rest cycles and reset behavior.

### Decisions

- Decision: Use a deterministic timer engine built around a simple phase model: idle, running, paused, stopped, and cycle transitions between focus and rest.
- Rationale: This keeps the core countdown logic predictable and easy to unit test without embedding business rules in React.
- Alternatives considered: A single component-local timer state with manual interval logic; rejected because it mixes UI concerns and domain rules, making behavior harder to test and maintain.

- Decision: Use browser-safe audio playback through a small notification utility that falls back to visual alerts when audio cannot be played.
- Rationale: The product requires both visual and audible notifications while remaining dependable across device/browser capabilities.
- Alternatives considered: Server-driven push notifications; rejected because the app is a local browser-first timer and the feature does not require backend infrastructure.

- Decision: Validate custom durations with Zod at the app boundary and then pass normalized values to the domain service.
- Rationale: This enforces safe defaults and prevents invalid values from entering timer logic.
- Alternatives considered: Direct parse logic in UI; rejected because it couples validation to presentation and is harder to test in isolation.

## Phase 1: Design & Contracts

### Data Model

The timer domain model will capture the current configuration and runtime state.

- TimerSettings
  - focusDurationSeconds: number
  - restDurationSeconds: number
  - autoRepeat: boolean
  - customFocusMinutes: number | null

- TimerState
  - phase: 'focus' | 'rest'
  - status: 'idle' | 'running' | 'paused' | 'stopped'
  - remainingSeconds: number
  - totalSeconds: number
  - isLoopEnabled: boolean

- NotificationEvent
  - type: 'focus-complete' | 'rest-complete' | 'session-stopped' | 'session-reset'
  - message: string

- TimerValidationResult
  - isValid: boolean
  - errors: string[]

### Domain Rules

- Focus and rest durations MUST be positive and within the allowed range.
- A custom duration can be specified in minutes and seconds but must be normalized before execution.
- When the countdown reaches zero, the timer transitions to the next phase if loop mode is enabled.
- If loop mode is disabled, the timer ends in the current phase and requires explicit user action to restart.
- Pause, resume, stop, and restart are modeled as explicit state transitions rather than side effects inside UI components.

### Interface Contracts

A minimal state contract will be defined for the timer and notification layer:

- `TimerSettingsInput`: validated before state creation.
- `TimerStateSnapshot`: exported from domain logic for UI rendering.
- `NotificationTrigger`: a thin message passed to the browser notification layer.

This contract is intentionally lightweight because the app does not expose backend APIs.

### Quickstart Validation Guide

1. Install dependencies with the project package manager.
2. Start the Next.js app in development mode.
3. Open the app in a desktop browser and a mobile browser emulator.
4. Choose a preset focus duration, start the timer, and confirm the countdown begins.
5. Pause and resume the timer to confirm lifecycle control works.
6. Confirm the timer switches to rest mode and triggers a notification when the focus period ends.
7. Enable loop mode and confirm the app continues through multiple focus/rest transitions without extra interaction.
8. Enter a custom duration in minutes and seconds and confirm the validation logic accepts valid values and rejects invalid ones.
9. Stop and restart the timer to confirm reset behavior is consistent and user-visible.

## Testing Strategy

- Unit tests for timer rules and validation logic should be created first.
- Integration tests should cover a full focus-rest cycle in a browser-like environment.
- UI tests should verify lifecycle controls, notifications, and loop behavior without asserting implementation-only internals.

### Test Cases

- Valid custom duration is accepted when within the supported range.
- Invalid custom duration is rejected with a descriptive error.
- Running timer transitions from focus to rest at zero.
- Pause stops time advances and resume continues from the current remaining duration.
- Stop resets the timer to the initial state.
- Loop mode keeps cycling while auto-repeat is enabled.
- Notification event is triggered for both phase completion and restart/stop actions.

## Risks and Trade-offs

- Browser timers can drift slightly under heavy page load; this is acceptable if the logic updates from a timestamp-based approach rather than a naive interval-only model.
- Audio notifications may be blocked by browser permissions; the app should degrade gracefully with a visual notification.
- A single-page design keeps the initial version simple, but it must remain modular enough for easy extension to more settings later.

## Implementation Sequence

1. Create the timer domain model and validation utilities.
2. Add the service layer that owns state transitions and phase logic.
3. Build the React UI for settings, display, and controls.
4. Connect the UI to the timer hook and browser notification helper.
5. Add focused tests for validation, lifecycle transitions, and repeat behavior.
6. Run the relevant Vitest suite and fix any regressions before sign-off.

## Constitution Re-check

After implementation, the design will be validated again against the constitution to confirm:

- Business logic remains separate from UI concerns.
- The custom duration validation is explicit and safe.
- Features are documented and testable.
- The solution stays simple and maintainable for a first-version prototype.

