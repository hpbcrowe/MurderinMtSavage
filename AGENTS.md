# AGENTS.md

## Project overview

This repository contains a full-stack application for Crowe Quest:

- Frontend: Angular app in `CroweQuest-UI/`
- Backend: ASP.NET Core app in `CroweQuest.Web/`
- Shared models: `CroweQuest.Models/`
- Repository layer: `CroweQuest.Repository/`
- Identity support: `CroweQuest.Identity/`
- Services: `BlogLab.Services/`

The app is a blog and genealogy-style application with authentication, blog posts, comments, and photo/media support.

## Working conventions

- Prefer small, targeted changes over broad refactors.
- Preserve existing naming patterns and project architecture.
- Keep Angular components focused on presentation and form state.
- Keep API logic in services/repositories and avoid business logic in UI components.
- Use Dependency Injection patterns already used by the app.

## Build and validation commands

Run these from the repository root or the UI folder as needed:

- .NET solution build:
  - `dotnet build CroweQuest.sln`
- Angular app run:
  - `cd CroweQuest-UI`
  - `npm install`
  - `npm start`
- Angular production build:
  - `cd CroweQuest-UI`
  - `npm run build`

## Azure deployment locations

Use these exact Azure targets when publishing or validating changes:

- Resource group: `CroweQuestGroup`
- Frontend app: `CroweQuest`
  - Public URL: `https://crowequest-f5crfzfpg6hrd4f4.westus2-01.azurewebsites.net`
- Backend app: `CroweQuestWebAPI`
  - Public URL: `https://crowequestwebapi-fyg8a3dhcpfudugv.westus2-01.azurewebsites.net`
- Database server: `crowequestdbserver` in `westus`

Do not invent new Azure app names or resource groups. Use the targets above unless the repo explicitly changes them.

## Deployment workflow

Use this exact workflow for the current Azure setup:

1. Build the frontend from the repo root:
   - `cd CroweQuest-UI`
   - `npm install`
   - `npm run build`
2. Deploy the generated `CroweQuest-UI/dist/crowe-quest-ui` output to the Azure App Service named `CroweQuest` in resource group `CroweQuestGroup`.
3. Validate the live frontend by requesting the `CroweQuest` public URL.
4. For API changes, deploy the backend to `CroweQuestWebAPI` and validate that backend URL before calling the work complete.
5. Do not use `ng serve` as the deployment mechanism. Local dev is for iteration only; Azure is the authoritative deployment target.

## Frontend guidance

- Angular code lives under `CroweQuest-UI/src/app/`.
- Keep feature modules/components organized by feature or domain area.
- Use existing model classes in `src/app/models/` and service patterns in `src/app/services/`.
- Prefer RxJS `Observable` patterns that match the existing codebase.
- Do not add ad hoc state patterns unless the existing architecture already uses them.
- UI validation should remain local to components where appropriate, but auth failures should be handled with user-friendly messages.

## Backend guidance

- ASP.NET Core app entry points are in `CroweQuest.Web/`.
- Repositories and interfaces are in `CroweQuest.Repository/`.
- Domain models are in `CroweQuest.Models/`.
- Identity-related concerns belong in `CroweQuest.Identity/`.
- Prefer repository patterns over putting data access directly in controllers.

## Security and configuration

- Do not hardcode secrets, tokens, or connection strings.
- Use configuration files and environment settings already present in the project.
- Be careful with authentication and authorization changes; they often affect both UI and API behavior.

## Commit and PR expectations

- Keep changes scoped to the task.
- If a fix touches multiple layers (UI + API + models), update the relevant files together.
- Leave the codebase in a working state and validate with the smallest relevant build or test command.

## Default behavior for Copilot / agents

When generating code for this repo:

- align with the existing .NET + Angular structure
- reuse existing service/repository/model conventions
- keep fixes minimal and readable
- avoid speculative architecture changes
- prefer the project’s current patterns over introducing new frameworks or libraries
