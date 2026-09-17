# Focus Timer App

A lightweight productivity timer built with Next.js, React, TypeScript, and TailwindCSS. The application helps users maintain a predictable focus rhythm using a fixed 5-minute rest period after every focus session.

## Features

- Preset focus durations: 3, 5, 10, 15, 20, 25, 30, 45, and 55 minutes
- Custom focus durations in minutes and seconds
- Fixed 5-minute rest period enforced by the system
- Start, pause, resume, stop, and restart controls
- Loop mode for automatic focus/rest cycling
- Visual status messaging for timer phase and lifecycle state
- Visible phase-completion notifications for focus and rest transitions
- Distinct audible cues for focus completion and rest completion when browser audio is available
- Browser-based audio notification with visual fallback
- Responsive layout for desktop and mobile browsers

## Rules

- Focus duration is configurable.
- Rest duration is fixed at 5 minutes and is not user-editable.
- The application must not expose or allow configuration of the rest duration in the UI or settings model.
- Completion events are emitted from the timer state so both visual and audible alerts are triggered exactly when a focus or rest phase ends.

## Local development

```bash
npm install
npm run dev
```

Then open the local app in a browser at the address reported by Next.js.

## Testing

```bash
npm test -- --run
```

The project includes unit and integration tests for timer validation, lifecycle behavior, transition logic, and UI flow.

## Notes

This app follows a domain-first design: business rules remain outside the React UI, keeping timer logic explicit, testable, and aligned with the product specification.
