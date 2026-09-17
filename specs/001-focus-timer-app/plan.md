# Implementation Plan: Focus Timer App

**Branch**: `001-focus-timer-app` | **Date**: 2026-08-19 | **Spec**: `/specs/001-focus-timer-app/spec.md`

**Input**: Feature specification from `/specs/001-focus-timer-app/spec.md`

**Note**: This plan follows the project constitution and the current DDD/hexagonal guidance, while keeping the initial version intentionally small and practical.

## Summary

Build a responsive single-page productivity timer that supports focus sessions with a fixed 5-minute rest period, preset and custom focus durations, lifecycle controls, automatic loop mode, and visual/audio notifications without introducing unnecessary application complexity. The solution will separate timer rules from the UI so that the domain logic remains explicit, testable, and easy to reason about.

## Technical Context

**Language/Version**: TypeScript in strict mode with Next.js and React

**Primary Dependencies**: Next.js, React, TailwindCSS, Zod, Vitest, Testing Library

**Storage**: N/A for v1; no persistence required by the current specification

**Testing**: Vitest with jsdom and component tests for timer logic and UI behavior

**Target Platform**: Desktop and mobile web browsers

**Project Type**: web-application

**Performance Goals**: Timer updates remain accurate to within one second; transitions feel immediate and responsive on common desktop and mobile devices.

**Constraints**: No authentication; no database; browser audio support is optional but fallback visual notifications are required; delays must remain low and predictable; the rest period is a fixed 5-minute system rule and cannot be configured or exposed in the interface.

**Scale/Scope**: Single-user demo application with one main timer screen and a limited set of interactions centered on focus sessions and the non-configurable 5-minute rest cycle.

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
- Validate the best fit for custom focus duration input handling with Zod and minimal UI overhead.
- Confirm the appropriate state model for focus/rest cycles and reset behavior.
- Confirm enforcement of a fixed 5-minute rest period without exposing any rest-duration configuration controls.

### Decisions

- Decision: Use a deterministic timer engine built around a simple phase model: idle, running, paused, stopped, and cycle transitions between focus and rest.
- Rationale: This keeps the core countdown logic predictable and easy to unit test without embedding business rules in React.
- Alternatives considered: A single component-local timer state with manual interval logic; rejected because it mixes UI concerns and domain rules, making behavior harder to test and maintain.

- Decision: Use browser-safe audio playback through a small notification utility that falls back to visual alerts when audio cannot be played.
- Rationale: The product requires both visual and audible notifications while remaining dependable across device/browser capabilities.
- Alternatives considered: Server-driven push notifications; rejected because the app is a local browser-first timer and the feature does not require backend infrastructure.

- Decision: Validate custom focus durations with Zod at the app boundary and then pass normalized values to the domain service while keeping the rest duration fixed at 5 minutes as a system constant.
- Rationale: This enforces safe defaults for focus sessions while preventing any UI or settings path from exposing rest-duration configuration, which would violate the fixed-cycle requirement.
- Alternatives considered: Direct parse logic in UI or a user-configurable rest duration; rejected because both would couple rule-breaking behavior to the interface and make validation harder to reason about.

## Phase 1: Design & Contracts

### Data Model

The timer domain model will capture the current configuration and runtime state.

- TimerSettings
  - focusDurationSeconds: number
  - autoRepeat: boolean
  - fixedRestDurationSeconds: 300 (system constant, not user-editable)

- TimerState
  - phase: 'focus' | 'rest'
  - status: 'idle' | 'running' | 'paused' | 'stopped'
  - remainingSeconds: number
  - totalSeconds: number
  - isLoopEnabled: boolean
  - fixedRestDurationSeconds: number

- NotificationEvent
  - type: 'focus-complete' | 'rest-complete' | 'session-stopped' | 'session-reset'
  - message: string

- TimerValidationResult
  - isValid: boolean
  - errors: string[]

### Domain Rules

- Focus durations MUST be positive and within the allowed range.
- The rest duration is a fixed system value of 5 minutes and MUST NOT be user-configurable.
- A custom focus duration can be specified in minutes and seconds but must be normalized before execution.
- When the countdown reaches zero, the timer transitions to the fixed 5-minute rest phase if loop mode is enabled.
- If loop mode is disabled, the timer ends in the current phase and requires explicit user action to restart.
- Pause, resume, stop, and restart are modeled as explicit state transitions rather than side effects inside UI components.

### Interface Contracts

A minimal state contract will be defined for the timer and notification layer:

- `TimerSettingsInput`: validated before state creation for focus duration and loop settings only.
- `TimerStateSnapshot`: exported from domain logic for UI rendering, including the fixed 5-minute rest cycle.
- `NotificationTrigger`: a thin message passed to the browser notification layer.

This contract is intentionally lightweight because the app does not expose backend APIs, and the rest duration remains a fixed internal constraint rather than a user-editable contract field.

### Quickstart Validation Guide

1. Install dependencies with the project package manager.
2. Start the Next.js app in development mode.
3. Open the app in a desktop browser and a mobile browser emulator.
4. Choose a preset focus duration or enter a custom focus duration in minutes and seconds, then start the timer to confirm the countdown begins.
5. Pause and resume the timer to confirm lifecycle control works.
6. Confirm the timer switches to a fixed 5-minute rest mode and triggers a notification when the focus period ends.
7. Enable loop mode and confirm the app continues through multiple focus/rest transitions without extra interaction.
8. Verify the interface does not expose any field or control for rest-duration configuration.
9. Stop and restart the timer to confirm reset behavior is consistent and user-visible.

## Testing Strategy

- Unit tests for timer rules and validation logic should be created first.
- Integration tests should cover a full focus-rest cycle in a browser-like environment.
- UI tests should verify lifecycle controls, notifications, and loop behavior without asserting implementation-only internals.

### Test Cases

- Valid custom focus duration is accepted when within the supported range.
- Invalid custom focus duration is rejected with a descriptive error.
- Running timer transitions from focus to a fixed 5-minute rest period at zero.
- Rest-duration controls are absent from the UI and the rest period remains fixed at 300 seconds.
- Pause stops time advances and resume continues from the current remaining duration.
- Stop resets the timer to the initial state.
- Loop mode keeps cycling while auto-repeat is enabled.
- Notification event is triggered for both phase completion and restart/stop actions.

## Risks and Trade-offs

- Browser timers can drift slightly under heavy page load; this is acceptable if the logic updates from a timestamp-based approach rather than a naive interval-only model.
- Audio notifications may be blocked by browser permissions; the app should degrade gracefully with a visual notification.
- A single-page design keeps the initial version simple, but it must remain modular enough for easy extension to more settings later.

## Implementation Sequence

1. Create the timer domain model and validation utilities, enforcing a fixed 5-minute rest duration as a system constant.
2. Add the service layer that owns state transitions and phase logic without exposing any rest-duration configuration.
3. Build the React UI for focus settings, display, and controls while omitting any rest-duration editing controls.
4. Connect the UI to the timer hook and browser notification helper.
5. Add focused tests for focus validation, fixed rest transitions, lifecycle transitions, and repeat behavior.
6. Run the relevant Vitest suite and fix any regressions before sign-off.

## Constitution Re-check

After implementation, the design will be validated again against the constitution to confirm:

- Business logic remains separate from UI concerns.
- The fixed 5-minute rest cycle is enforced system-wide and not exposed as a configurable setting.
- The custom focus-duration validation is explicit and safe.
- Features are documented and testable.
- The solution stays simple and maintainable for a first-version prototype.

