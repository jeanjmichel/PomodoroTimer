# Quickstart: Focus Timer App

## Prerequisites

- A modern web browser
- Node.js and a package manager available in the project environment
- The project dependencies installed

## Setup

1. Install dependencies.
2. Start the Next.js development server.
3. Open the application in the browser.

## Validation Scenarios

### Scenario 1: Preset focus session

1. Open the timer screen.
2. Select a preset focus duration.
3. Start the timer.
4. Confirm the display updates and the timer counts down.
5. Confirm the state label matches the current focus session.

### Scenario 2: Custom duration validation

1. Open the custom duration input.
2. Enter a valid value such as 12 minutes and 30 seconds.
3. Confirm the timer accepts the duration.
4. Enter an invalid value such as 0 minutes or 90 minutes.
5. Confirm the app shows a validation error and prevents the timer from starting.

### Scenario 3: Pause and resume

1. Start a timer.
2. Pause it.
3. Confirm the countdown stops.
4. Resume it.
5. Confirm the countdown continues from the same remaining time.

### Scenario 4: Phase transition and notification

1. Start a focus session.
2. Allow it to reach zero.
3. Confirm that the app switches into rest mode and displays the new phase.
4. Confirm the browser triggers a visible notification and an audible cue if allowed.

### Scenario 5: Loop mode

1. Enable auto-repeat.
2. Start the timer.
3. Confirm the app cycles through focus/rest transitions until stopped.
4. Stop the timer manually.
5. Confirm the app returns to the idle state.

## Expected Results

- The timer is easy to start and understand.
- Users can control lifecycle states without confusion.
- State transitions are clearly communicated.
- Invalid custom durations are rejected before execution.
- Loop mode continues the rhythm with minimal user interaction.
