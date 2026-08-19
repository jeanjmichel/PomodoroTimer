# Data Model: Focus Timer App

## Entities

### TimerSettings

Represents the user-selected configuration for a timer cycle.

- `focusDurationSeconds: number`
- `restDurationSeconds: number`
- `autoRepeat: boolean`
- `customDurationMinutes: number | null`
- `customDurationSeconds: number | null`

**Validation rules**
- Focus duration must be greater than zero.
- Rest duration must be greater than zero.
- Custom duration values must be within the supported range for the app.
- Invalid combinations should be rejected before the timer is started.

### TimerState

Represents the current runtime state of the countdown.

- `phase: 'focus' | 'rest'`
- `status: 'idle' | 'running' | 'paused' | 'stopped'`
- `remainingSeconds: number`
- `totalSeconds: number`
- `isLoopEnabled: boolean`
- `startedAt: number | null`
- `lastTickAt: number | null`

**Validation rules**
- Remaining time must be non-negative.
- Total time must match the active phase duration.
- Status and phase must remain consistent after every transition.

### NotificationEvent

Represents the browser-visible or audible event emitted when a phase transitions.

- `type: 'focus-complete' | 'rest-complete' | 'session-stopped' | 'session-reset'`
- `message: string`
- `playAudio: boolean`

### TimerValidationResult

Represents the result of validating a custom duration.

- `isValid: boolean`
- `errors: string[]`

## Relationships

- One `TimerSettings` instance produces one active `TimerState`.
- Each `TimerState` transition may emit one or more `NotificationEvent`s.
- Loop mode repeatedly reuses the same state model across focus and rest phases.

## State Transitions

- `idle` -> `running` when the user starts a timer.
- `running` -> `paused` when the user pauses.
- `paused` -> `running` when the user resumes.
- `running` -> `stopped` when the user stops.
- `running` -> `idle` when the timer ends and loop mode is off.
- `running` -> `running` with phase swap when the timer reaches zero and loop mode is on.
