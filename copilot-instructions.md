# Copilot Instructions - PomodoroTimer

## Context

PomodoroTimer is a cloud-native application built with Domain-Driven Design (DDD) and Hexagonal Architecture.

All implementations must comply with the project Constitution.

When a conflict exists between this document and the Constitution, the Constitution takes precedence.

Always review existing code before proposing changes and maintain consistency with the established architecture and conventions.

---

# Technology Stack

## Backend

- Node.js
- Next.js
- TypeScript (strict mode)

## Frontend

- React
- TypeScript
- TailwindCSS

## Data Layer

- Prisma ORM

## Validation

- Zod

## Authentication

- JWT

## Password Security

- Argon2

## Testing

- Vitest (preferred) or Jest

---

# General Development Rules

## Code Quality

Always:

- Use TypeScript strict mode.
- Use explicit typing.
- Prefer interfaces over loosely typed objects.
- Use English for all code.
- Use clear and descriptive names.
- Follow SOLID principles.
- Prefer composition over inheritance.
- Favor readability over cleverness.
- Favor explicit behavior over implicit behavior.
- Keep functions small and focused.
- Keep classes focused on a single responsibility.

Never:

- Use `any`.
- Introduce unnecessary abstractions.
- Create hidden side effects.
- Add complexity without justification.
- Use unclear abbreviations.
- Ignore linting errors.

---

# Architectural Rules

The project uses Hexagonal Architecture.

Dependencies must always point inward.

---

## Domain Layer

Purpose:

- Business rules.
- Entities.
- Value Objects.
- Domain Services.
- Repository Contracts.
- Business Validation.

Allowed:

- TypeScript only.
- Pure business logic.

Forbidden:

- Prisma.
- React.
- Next.js.
- HTTP.
- API calls.
- Database access.
- External services.
- Framework-specific code.

Requirements:

- Business invariants must be enforced here.
- Inputs must be validated according to domain rules.
- Domain must remain framework-independent.

---

## Application Layer

Purpose:

- Use Cases.
- Orchestration.
- DTOs.
- Transaction boundaries.
- Coordination between services.

Responsibilities:

- Execute business workflows.
- Invoke domain logic.
- Communicate through repository interfaces.
- Return DTOs.

Forbidden:

- Database access.
- Framework concerns.
- UI concerns.

---

## Infrastructure Layer

Purpose:

- Persistence.
- External APIs.
- Authentication providers.
- Logging.
- Framework integrations.

Responsibilities:

- Implement domain interfaces.
- Isolate external dependencies.

Rules:

- Prisma must only be used inside infrastructure.
- Repository implementations belong here.
- Infrastructure must not contain business rules.

---

## Interface Layer

Purpose:

- API routes.
- Controllers.
- React components.
- View models.
- Hooks.

Responsibilities:

- Receive requests.
- Validate transport-level input.
- Delegate execution to use cases.
- Return formatted responses.

Never:

- Implement business rules.
- Access repositories directly.
- Access Prisma directly.

Routes and controllers must remain thin.

---

# Repository Pattern

Always:

- Define repository contracts in the Domain layer.
- Implement repositories in Infrastructure.
- Depend on interfaces, never implementations.

Example:

Domain

```ts
interface TaskRepository {}
