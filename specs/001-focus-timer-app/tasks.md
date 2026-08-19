# Tasks: Focus Timer App

**Input**: Design documents from `/specs/001-focus-timer-app/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Testing is part of the implementation plan and is required for timer logic and user flows.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3])
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the project structure and install the base web app dependencies required for the timer feature.

- [ ] T001 Create the application structure for app/, components/, domain/, hooks/, lib/, and tests/ per the implementation plan
- [ ] T002 [P] Initialize a Next.js + React + TypeScript app with TailwindCSS and the required project scripts in package.json and config files
- [ ] T003 Configure the root app shell and global styling in app/layout.tsx and app/globals.css
- [ ] T004 [P] Configure Vitest, Testing Library, and jsdom for unit and integration testing in vitest.config.ts and test setup files

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the core timer model, validation utilities, and browser notification primitives before any user story work starts.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T005 Create the timer type definitions and domain constants in domain/timer/timer.types.ts and domain/timer/timer.constants.ts
- [ ] T006 Implement Zod-based custom duration validation in domain/timer/timer-validation.ts
- [ ] T007 [P] Create the state transition and phase rules in domain/timer/timer-rules.ts
- [ ] T008 [P] Implement the timer service that owns lifecycle transitions, loop behavior, and reset logic in domain/timer/timer-service.ts
- [ ] T009 Create the browser notification utility that can play audio and show a fallback visual alert in lib/browser-audio.ts
- [ ] T010 [P] Add a time-formatting helper in lib/format-time.ts
- [ ] T011 Create the timer hook that binds timer state to browser timers in hooks/useTimer.ts
- [ ] T012 [P] Create the notification hook for state-change events in hooks/useNotification.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Start a focused work session (Priority: P1) 🎯 MVP

**Goal**: Allow the user to choose a preset or custom duration and start a valid focus session with clear countdown feedback.

**Independent Test**: A user can select a duration, start the timer, and observe the session count down without additional setup.

### Tests for User Story 1

- [ ] T013 [P] [US1] Add unit tests for valid and invalid custom durations in tests/unit/timer-validation.test.ts
- [ ] T014 [P] [US1] Add unit tests for session start and duration normalization in tests/unit/timer-service.test.ts

### Implementation for User Story 1

- [ ] T015 [P] [US1] Build the timer settings form and preset duration controls in components/timer/TimerSettingsForm.tsx
- [ ] T016 [P] [US1] Build the countdown display in components/timer/TimerDisplay.tsx
- [ ] T017 [US1] Add the main timer dashboard composition in components/timer/TimerDashboard.tsx
- [ ] T018 [US1] Implement start and configuration behavior in app/page.tsx and/or the timer hook integration
- [ ] T019 [US1] Add a visible session-state indicator and current phase messaging in components/timer/TimerDashboard.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Move between work and rest periods (Priority: P1)

**Goal**: Transition automatically between focus and rest periods and support loop mode with minimal user interaction.

**Independent Test**: A user can complete a focus session and confirm the app moves to rest mode and optionally continues the cycle.

### Tests for User Story 2

- [ ] T020 [P] [US2] Add unit tests for phase transitions and loop behavior in tests/unit/timer-rules.test.ts
- [ ] T021 [P] [US2] Add a full integration test for focus-to-rest transitions in tests/integration/timer-flow.test.tsx

### Implementation for User Story 2

- [ ] T022 [US2] Implement phase-shift logic when the timer reaches zero in domain/timer/timer-rules.ts and domain/timer/timer-service.ts
- [ ] T023 [US2] Add loop-mode support and restart behavior to the timer service in domain/timer/timer-service.ts
- [ ] T024 [US2] Wire loop-mode controls into the UI in components/timer/TimerControls.tsx
- [ ] T025 [US2] Show the active phase and cycle state in the dashboard and timer display components
- [ ] T026 [US2] Add a user-friendly notification banner for phase transitions in components/ui/NotificationBanner.tsx

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - Manage timer lifecycle and notifications (Priority: P2)

**Goal**: Allow users to pause, resume, stop, and restart the session while receiving clear visual and audible state-change notifications.

**Independent Test**: A user can pause, resume, stop, and restart the timer and observe consistent feedback and alerts.

### Tests for User Story 3

- [ ] T027 [P] [US3] Add integration tests for pause/resume/stop/restart flows in tests/integration/timer-flow.test.tsx
- [ ] T028 [P] [US3] Add unit tests for notification triggers and event payloads in tests/unit/timer-service.test.ts

### Implementation for User Story 3

- [ ] T029 [US3] Implement pause, resume, stop, and restart actions in the timer service and hook logic
- [ ] T030 [US3] Add timer controls for pause, resume, stop, and restart in components/timer/TimerControls.tsx
- [ ] T031 [US3] Ensure the timer dashboard reflects the current lifecycle status without hidden side effects
- [ ] T032 [US3] Trigger visual and audible notifications for session transitions via the notification hook and browser audio utility
- [ ] T033 [US3] Add a reset path that clears the current session and prepares for a new cycle cleanly

**Checkpoint**: At this point, User Story 3 should be independently functional and the core feature is ready for verification.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements that affect the entire timer workflow and ensure the app is ready for a simple productivity demo.

- [ ] T034 [P] Review the app for responsive mobile layout and readability in app/page.tsx and app/globals.css
- [ ] T035 [P] Validate that all timer state transitions align with requirements and are easy to understand in the UI
- [ ] T036 [P] Run the focused Vitest suite covering validation, service logic, and integration flows
- [ ] T037 [P] Fix any linting or type issues reported by the project toolchain and ensure strict TypeScript compliance
- [ ] T038 Run the quickstart validation guide and confirm the feature works end-to-end in the browser

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion - MVP path
- **User Story 2 (Phase 4)**: Depends on Phase 3 completion for integration and can run in parallel after the first story is stable
- **User Story 3 (Phase 5)**: Depends on the timer core and UI from earlier phases
- **Polish (Final Phase)**: Depends on the completed story work

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories; this is the MVP entry point
- **User Story 2 (P1)**: Depends on the timer lifecycle created in US1 but should remain independently testable
- **User Story 3 (P2)**: Depends on the same core timer model and remains independently testable

### Within Each User Story

- Tests first for domain and lifecycle behavior
- Domain logic before UI wiring
- UI state and controls after the logic is stable
- End-to-end validation before moving to the next story

### Parallel Opportunities

- Setup tasks T002 and T004 can run in parallel
- Foundational tasks T007, T010, and T012 can run in parallel after the domain primitives are in place
- User Story 1 tests T013 and T014 can run in parallel
- User Story 2 tests T020 and T021 can run in parallel
- User Story 3 tests T027 and T028 can run in parallel

---

## Parallel Example: User Story 1

```bash
Task: "Add unit tests for valid and invalid custom durations in tests/unit/timer-validation.test.ts"
Task: "Add unit tests for session start and duration normalization in tests/unit/timer-service.test.ts"
Task: "Build the timer settings form and preset duration controls in components/timer/TimerSettingsForm.tsx"
Task: "Build the countdown display in components/timer/TimerDisplay.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Confirm the timer can be configured and started successfully
5. Add User Story 2 and User Story 3 only after the MVP is stable

### Incremental Delivery

1. Setup + Foundational provide the timer engine and validation primitives
2. Story 1 delivers the core timer workflow and verifies the MVP
3. Story 2 adds automatic cycle transitions and loop mode
4. Story 3 completes lifecycle controls and notification behavior
5. Final polish validates responsiveness and end-to-end behavior

---

## Notes

- [P] tasks indicate different files or isolated work with no dependency overlap
- [Story] labels map each task to a specific story for traceability
- Every story should be independently testable and deployable as a functional increment
- All tasks include exact file paths for implementation and validation work
- The timer domain remains explicit and testable, with the UI kept thin and presentation-focused
