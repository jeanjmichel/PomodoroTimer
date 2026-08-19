# Research: Focus Timer App

## Decisions

### Decision: Use a domain-based countdown engine

**Decision**: Timer behavior will be modeled as a pure domain service that owns time progression, phase transitions, pause/resume, stop/reset, and loop behavior.

**Rationale**: This matches the constitution and keeps the core logic independent from UI state and browser APIs. It also makes the logic easier to test and reason about.

**Alternatives considered**:
- Keep the timer logic inside a React component: simple at first but mixes UI concerns with business rules and makes validation harder.
- Use a backend service for timer state: unnecessary for a client-only productivity demo and adds avoidable infrastructure complexity.

### Decision: Use browser notifications with graceful fallback

**Decision**: State transitions will trigger both an in-app visual banner and an optional browser audio cue when allowed by the browser.

**Rationale**: The specification requires both visual and audible notifications, while also making the app usable when audio is blocked or unavailable.

**Alternatives considered**:
- Require audio autoplay permission on every session: too fragile for a simple demo and inconsistent across browsers.
- Use only visual notifications: fails the requirement for audible transitions.

### Decision: Validate custom durations at the boundary with Zod

**Decision**: A Zod schema will validate user-entered durations before they reach the timer domain service.

**Rationale**: This keeps validation explicit, reusable, and easier to test than placing rules inside the UI layer.

**Alternatives considered**:
- Validate only on the client side without a schema: more error-prone and less reusable.
- Validate in the React component alone: couples UI to business rules.

### Decision: Use a simple phase model to represent timer state

**Decision**: The timer state will be represented by a clear phase and status tuple: focus/rest plus idle/running/paused/stopped.

**Rationale**: A simple model supports explicit behavior for transitions, loop mode, and reset logic without hidden side effects.

**Alternatives considered**:
- Store only a remaining time value and infer phase from context: harder to reason about and easier to break.
- Introduce a more complex event-sourced model: unnecessary for a single-page timer demo.

## Open Technical Considerations

- Browser timer drift is acceptable if the app uses timestamps for progress updates rather than raw interval steps.
- Audio playback may require user interaction before playback is allowed; the app should still notify visually when blocked.
- The initial release does not require persistence, authentication, or a database. This aligns with the specification and keeps the feature focused.
