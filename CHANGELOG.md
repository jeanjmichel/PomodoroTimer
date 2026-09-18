# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog.

## [Unreleased]

### Added

- Initial Spec-Driven Development setup.
- Project constitution.
- Copilot instructions.
- Feature specification for Focus Timer App.
- Implementation plan for Focus Timer App.
- Task breakdown for Focus Timer App.
- Focus Timer App with a fixed 5-minute rest cycle and preset/custom focus durations.
- Custom focus-duration validation using Zod for minutes and seconds input.
- Automatic focus-to-rest transition logic with loop mode support.
- Timer lifecycle controls for start, pause, resume, stop, and restart.
- Visual session-state display and status messaging for focus and rest phases.
- Browser audio notification support with graceful visual fallback messaging.
- Notification banner for session transitions and lifecycle updates.
- Unit and integration test coverage for validation, timer rules, service behavior, and user flow.

### Changed

- Structured the app around a domain-driven timer model separated from the React presentation layer.
- Centralized timer state transitions and business rules in dedicated domain and service modules.
- Updated the app shell and styling to provide a responsive, single-page productivity timer UI.
- Wired timer settings and lifecycle actions into a unified dashboard experience for desktop and mobile browsing.
- Adjusted the timer state model to track phase durations and loop behavior consistently across updates.

### Fixed

- Resolved Vitest alias configuration issues so the app and tests resolve project imports correctly.
- Corrected timer phase transitions to ensure loop mode advances between focus and rest periods as expected.
- Removed the user-configurable rest-duration control and enforced the required fixed 5-minute rest period across the app.
- Fixed the notification flow so phase completion events are emitted from the timer state instead of UI side effects.
- Prevented the infinite render loop triggered by repeated notification dispatches during focus and rest completion.
- Ensured focus and rest transitions display a visible notification and emit distinct audible cues when browser audio is available.
- Stabilized the dashboard test selectors and lifecycle assertions for reliable integration coverage.
- Ensured valid duration handling rejects out-of-range values and preserves the minimum/maximum constraints.
- Improved timer reset behavior so new cycles start cleanly from the configured focus duration and fixed rest phase.